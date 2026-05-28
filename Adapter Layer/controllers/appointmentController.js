import * as appointmentService from '../services/appointmentService.js';

export const createAppointment = async (req, res) => {
    try {
        const modernData = req.body;
        
        const result = await appointmentService.processNewAppointment(modernData);
        
        res.status(201).json({
            success: true,
            message: "Appointment successfully scheduled in Legacy System",
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

export const getPatientAppointments = async (req, res) => {
    try {
        const { patientId } = req.params;
        
        const result = await appointmentService.fetchAppointmentsByPatient(patientId);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(404).json({ 
            success: false, 
            error: "Fetch Failed",
            message: error.message 
        });
    }
};