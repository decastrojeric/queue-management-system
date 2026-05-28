import fetch from 'node-fetch';

const LEGACY_URL = process.env.LEGACY_SYSTEM_URL;

export const sendToLegacySystem = async (modernData) => {
    const legacyPayload = {
        patientId: modernData.patientId,
        serviceDescription: modernData.description,   
        amount: Number(modernData.cost),           
        dateIssued: modernData.issuedDate,            
        billingStatus: modernData.status || "Unpaid" 
    };

    console.log("Transforming data to Legacy Billing payload model:", legacyPayload);

    const response = await fetch(`${LEGACY_URL}/billing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(legacyPayload)
    });

    if (!response.ok) {
        const legacyErr = await response.json();
        throw new Error(legacyErr.error || "The Legacy Database dropped the ledger creation request.");
    }

    const legacyData = await response.json();
    return {
        legacyBillingId: legacyData._id,
        syncStatus: "Committed into Core Ledger Database"
    };
};

export const fetchFromLegacySystem = async (patientId) => {
    const response = await fetch(`${LEGACY_URL}/billing/${patientId}`);
    if (!response.ok) throw new Error("Failed to pull billing profile details from legacy storage engine.");
    
    const rawLegacyList = await response.json();

    return rawLegacyList.map(legacyRecord => ({
        billingId: legacyRecord._id,
        patientId: legacyRecord.patientId,
        description: legacyRecord.serviceDescription,   
        // Account for Mongoose Decimal128 wrapping structure
        cost: legacyRecord.amount ? (legacyRecord.amount.$numberDecimal || legacyRecord.amount) : 0, 
        issuedDate: legacyRecord.dateIssued,            
        status: legacyRecord.billingStatus,             
        createdAt: legacyRecord.createdAt
    }));
};

export const updateStatusToPaidInLegacy = async (billingId) => {
    const response = await fetch(`${LEGACY_URL}/billing/${billingId}/mark-paid`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error("Target invoice not found or legacy system connection failure occurred.");
    }

    const legacyUpdatedRecord = await response.json();
    
    return {
        billingId: legacyUpdatedRecord._id,
        status: legacyUpdatedRecord.billingStatus,
        resolutionTime: legacyUpdatedRecord.updatedAt
    };
};