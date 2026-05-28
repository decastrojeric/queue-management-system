import * as patientService from '../services/patientService.js';

export const createPatient = async (req, res) => {
    try {
        const modernData = req.body;
        const result = await patientService.processNewPatient(modernData);
        
        res.status(201).json({
            success: true,
            message: "Patient successfully created in Legacy System",
            data: result
        });
    } catch (error) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({
            success: false,
            error: "Request Failed",
            message: error.message
        });
    }
};

export const getPatientById = async (req, res) => {
    try {
        const result = await patientService.fetchPatient(req.params.id);
        
        res.status(200).json({ 
            success: true, 
            data: result 
        });
    } catch (error) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({ 
            success: false, 
            error: "Fetch Failed",
            message: error.message 
        });
    }
};

export const getAllPatients = async (req, res) => {
    try {
        const result = await patientService.fetchAllPatients();

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Fetch Failed",
            message: error.message
        });
    }
};