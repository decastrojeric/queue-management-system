import express from 'express';
import 'dotenv/config.js';
import patientRoutes from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js'; 
import billingRoutes from './routes/billingRoutes.js';  

const app = express();
app.use(express.json());

// Register the routes
app.use('/api/adapter/patients', patientRoutes);
app.use('/api/adapter/appointments', appointmentRoutes);
app.use('/api/adapter/consultations', consultationRoutes);
app.use('/api/adapter/billing', billingRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Adapter Layer Internal Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`HAS Adapter Layer running securely on port ${PORT}`);
});