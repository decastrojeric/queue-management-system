import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import * as billingController from '../controllers/billingController.js';

const router = express.Router();

// Financial records can only be created or modified by Staff/Admin
router.post('/create', authMiddleware, restrictTo('staff', 'admin'), billingController.createBilling);
router.put('/:billingId/mark-paid', authMiddleware, restrictTo('staff', 'admin'), billingController.markBillingPaid);

// Patients can view their own financial history
router.get('/history/:patientId', authMiddleware, restrictTo('patient', 'staff', 'admin'), billingController.getBillingHistory);

export default router;