import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import * as patientController from '../controllers/patientController.js';

const router = express.Router();

// Profile Creation
router.post('/create', authMiddleware, restrictTo('patient', 'staff', 'admin'), patientController.createPatient);

// High Security: Only Doctors, Staff, and Admins can view the full patient list
router.get('/', authMiddleware, restrictTo('doctor', 'staff', 'admin'), patientController.getAllPatients);

// Individual Profile: Patients can view it, along with hospital staff
router.get('/:id', authMiddleware, restrictTo('patient', 'doctor', 'staff', 'admin'), patientController.getPatientById);

export default router;