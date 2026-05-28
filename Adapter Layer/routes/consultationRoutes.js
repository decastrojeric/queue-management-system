import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import * as consultationController from '../controllers/consultationController.js';

const router = express.Router();

// Clinical records can only be written by Doctors
router.post('/create', authMiddleware, restrictTo('doctor', 'admin'), consultationController.createConsultation);

// History can be viewed by the patient or medical staff
router.get('/history/:patientId', authMiddleware, restrictTo('patient', 'doctor', 'staff', 'admin'), consultationController.getConsultationHistory);

export default router;