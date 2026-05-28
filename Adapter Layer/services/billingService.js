import * as billingAdapter from '../adapters/billingAdapter.js';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const processNewBilling = async (modernData) => {

    const requiredFields = ['patientId', 'description', 'cost', 'issuedDate'];
    const missingFields = [];

    for (const field of requiredFields) {
        if (modernData[field] === undefined || modernData[field] === null || String(modernData[field]).trim() === "") {
            missingFields.push(field);
        }
    }

    if (missingFields.length > 0) {
        const error = new Error(`Validation Error: Incomplete transactional parameters. Missing fields: ${missingFields.join(', ')}`);
        error.status = 400; 
        throw error;
    }

    if (isNaN(modernData.cost) || Number(modernData.cost) <= 0) {
        const error = new Error("Validation Error: Field 'cost' must evaluate to a positive numerical value.");
        error.status = 400;
        throw error;
    }

    if (!objectIdRegex.test(modernData.patientId)) {
        const error = new Error(`Validation Error: patientId structure '${modernData.patientId}' is invalid. Must match a 24-character hexadecimal string.`);
        error.status = 400;
        throw error;
    }

    return await billingAdapter.sendToLegacySystem(modernData);
};

export const fetchHistoryByPatient = async (patientId) => {
    if (!patientId || !objectIdRegex.test(patientId)) {
        const error = new Error("Validation Error: Patient ID query lookup parameter must be a valid 24-character hex string.");
        error.status = 400;
        throw error;
    }
    
    return await billingAdapter.fetchFromLegacySystem(patientId);
};

export const processMarkAsPaid = async (billingId) => {
    if (!billingId || !objectIdRegex.test(billingId)) {
        const error = new Error("Validation Error: Target billingId path parameter is structurally invalid.");
        error.status = 400;
        throw error;
    }
    
    return await billingAdapter.updateStatusToPaidInLegacy(billingId);
};