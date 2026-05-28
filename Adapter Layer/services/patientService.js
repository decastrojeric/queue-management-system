import * as patientAdapter from '../adapters/patientAdapter.js';

export const processNewPatient = async (modernData) => {
    const requiredFields = ['firstName', 'lastName', 'dob', 'streetAddress', 'city', 'contactNumber'];
    const missingFields = [];

    for (const field of requiredFields) {
        if (!modernData[field] || modernData[field].trim() === "") {
            missingFields.push(field);
        }
    }

    if (missingFields.length > 0) {
        const errorMessage = `Validation Error: Incomplete patient data. Missing required fields: ${missingFields.join(', ')}`;
        
        const error = new Error(errorMessage);
        error.status = 400; 
        throw error;
    }

    const legacyResponse = await patientAdapter.sendToLegacySystem(modernData);

    return legacyResponse;
};

export const fetchPatient = async (patientId) => {
   
    if (!patientId) {
        const error = new Error("Patient ID is required.");
        error.status = 400;
        throw error;
    }
    
    return await patientAdapter.fetchPatientFromLegacy(patientId);
};

export const fetchAllPatients = async () => {
    return await patientAdapter.fetchAllPatientsFromLegacy();
};