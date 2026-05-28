import * as appointmentAdapter from '../adapters/appointmentAdapter.js';
import { fetchPatientFromLegacy } from '../adapters/patientAdapter.js';

export const processNewAppointment = async (modernData) => {

    const requiredFields = ['patientId', 'doctor', 'date', 'dept'];
    const missingFields = [];

    for (const field of requiredFields) {
        if (!modernData[field] || modernData[field].trim() === "") {
            missingFields.push(field);
        }
    }

    if (missingFields.length > 0) {
        const error = new Error(`Validation Error: Missing required fields: ${missingFields.join(', ')}`);
        error.status = 400;
        throw error;
    }

    const { patientId } = modernData;

    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(patientId)) {
        const error = new Error("Validation Error: Invalid format for patientId. Must be a valid 24-character hexadecimal ID.");
        error.status = 400;
        throw error;
    }

    try {
        console.log(`Validating patient existence for ID: ${patientId}...`);
        await fetchPatientFromLegacy(patientId); 
        console.log("Patient verified. Proceeding with appointment creation.");
    } catch (adapterError) {
        const error = new Error(`Validation Error: The provided patientId '${patientId}' does not exist in the Hospital System.`);
        error.status = 404;
        throw error;
    }

    const legacyResponse = await appointmentAdapter.sendToLegacySystem(modernData);

    return legacyResponse;
};

export const fetchAppointmentsByPatient = async (patientId) => {
    if (!patientId) {
        const error = new Error("Patient ID is required.");
        error.status = 400;
        throw error;
    }
    return await appointmentAdapter.fetchFromLegacySystem(patientId);
};