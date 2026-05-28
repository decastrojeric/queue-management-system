import * as consultationService from '../services/consultationService.js';

export const createConsultation = async (req, res) => {
    try {
        const modernData = req.body;
        const result = await consultationService.processNewConsultation(modernData);
        
        res.status(201).json({
            success: true,
            message: "Consultation file successfully recorded in Legacy System",
            data: result
        });
    } catch (error) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({
            success: false,
            error: "Clinical Ingress Failed",
            message: error.message
        });
    }
};

export const getConsultationHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const result = await consultationService.fetchHistoryByPatient(patientId);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({
            success: false,
            error: "Clinical Retrieval Failed",
            message: error.message
        });
    }
};