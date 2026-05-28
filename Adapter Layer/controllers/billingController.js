import * as billingService from '../services/billingService.js';

export const createBilling = async (req, res) => {
    try {
        const modernData = req.body;
        const result = await billingService.processNewBilling(modernData);
        
        res.status(201).json({
            success: true,
            message: "Billing record successfully posted to Legacy System",
            data: result
        });
    } catch (error) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({
            success: false,
            error: "Billing Ingress Failed",
            message: error.message
        });
    }
};

export const getBillingHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const result = await billingService.fetchHistoryByPatient(patientId);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({
            success: false,
            error: "Billing History Retrieval Failed",
            message: error.message
        });
    }
};

export const markBillingPaid = async (req, res) => {
    try {
        const { billingId } = req.params;
        const result = await billingService.processMarkAsPaid(billingId);
        
        res.status(200).json({
            success: true,
            message: "Invoice successfully marked as PAID in Legacy System",
            data: result
        });
    } catch (error) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({
            success: false,
            error: "Invoice Status Update Failed",
            message: error.message
        });
    }
};