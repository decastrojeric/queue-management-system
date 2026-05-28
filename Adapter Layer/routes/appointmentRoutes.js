import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import * as appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/create', authMiddleware, restrictTo('patient', 'staff', 'admin'), appointmentController.createAppointment);
router.get('/patient/:patientId', authMiddleware, restrictTo('patient', 'doctor', 'staff', 'admin'), appointmentController.getPatientAppointments);

export default router;