import * as consultationAdapter from '../adapters/consultationAdapter.js';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const processNewConsultation = async (modernData) => {

    const requiredFields = ['patientId', 'appointmentId', 'clinicalFinding', 'rx'];
    const missingFields = [];

    for (const field of requiredFields) {
        if (!modernData[field] || modernData[field].trim() === "") {
            missingFields.push(field);
        }
    }

    if (missingFields.length > 0) {
        const error = new Error(`Validation Error: Incomplete data profile. Missing fields: ${missingFields.join(', ')}`);
        error.status = 400; 
        throw error;
    }

    const { patientId, appointmentId } = modernData;
    
    if (!objectIdRegex.test(patientId)) {
        const error = new Error(`Validation Error: patientId value '${patientId}' is structurally invalid. Must be a 24-character hex string.`);
        error.status = 400;
        throw error;
    }
    
    if (!objectIdRegex.test(appointmentId)) {
        const error = new Error(`Validation Error: appointmentId value '${appointmentId}' is structurally invalid. Must be a 24-character hex string.`);
        error.status = 400;
        throw error;
    }
    return await consultationAdapter.sendToLegacySystem(modernData);
};

export const fetchHistoryByPatient = async (patientId) => {

    if (!patientId || !objectIdRegex.test(patientId)) {
        const error = new Error("Validation Error: A structurally valid 24-character hex patientId parameter is mandatory.");
        error.status = 400;
        throw error;
    }
    
    return await consultationAdapter.fetchFromLegacySystem(patientId);
};