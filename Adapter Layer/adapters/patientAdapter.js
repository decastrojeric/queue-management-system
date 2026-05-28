import fetch from 'node-fetch';

const LEGACY_URL = process.env.LEGACY_SYSTEM_URL;

export const sendToLegacySystem = async (modernData) => {
  
    const legacyPayload = {
        name: `${modernData.firstName} ${modernData.lastName}`,
        birthdate: modernData.dob,
        address: `${modernData.streetAddress}, ${modernData.city}`,
        phone: modernData.contactNumber,
        patientStatus: modernData.status || "Active"
    };

    console.log("Translating to Legacy Payload:", legacyPayload);

   
    const response = await fetch(`${LEGACY_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(legacyPayload)
    });

    if (!response.ok) {
        throw new Error("Legacy System failed to process the transaction.");
    }

    const legacyData = await response.json();
    
    return {
        legacyId: legacyData._id,
        status: "Synced with Central DB"
    };
};

export const fetchPatientFromLegacy = async (id) => {
    const response = await fetch(`${LEGACY_URL}/patients/${id}`);
    
    if (!response.ok) {
        const error = new Error("Patient not found in legacy system.");
        error.status = 404;
        throw error;
    }
    
    const legacyData = await response.json();

    const nameParts = legacyData.name.split(' ');
    
    return {
        id: legacyData._id, 
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' '),
        dob: legacyData.birthdate,
        contactNumber: legacyData.phone,
        status: legacyData.patientStatus
    };
};

export const fetchAllPatientsFromLegacy = async () => {
    const response = await fetch(`${LEGACY_URL}/patients`);
    
    if (!response.ok) throw new Error("Failed to fetch patients from legacy system.");
    
    const rawLegacyList = await response.json();

    return rawLegacyList.map(legacyData => {
       
        const nameParts = legacyData.name ? legacyData.name.split(' ') : ["Unknown", ""];
        
        return {
            id: legacyData._id,
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(' '),
            dob: legacyData.birthdate,
            contactNumber: legacyData.phone,
            status: legacyData.patientStatus
        };
    });
};