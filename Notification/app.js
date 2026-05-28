
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import notificationRoutes, { limiter as logsLimiter } from './routers/notificationRoutes.js';

const app = express();

app.set('trust proxy', true);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

app.use(express.json());
app.use((req, res, next) => { console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`); next(); });

await connectDB();

app.use('/api', notificationRoutes);


app.get('/', (req, res) => {
  res.status(200).json({ success: true, service: 'Notification System', version: '1.0.0', status: 'running', timestamp: new Date(), endpoints: { health: '/api/health', notify: 'POST /api/notify (requires JWT)', logs: 'GET /api/notification-logs (requires JWT)' } });
});

app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint not found', code: 'NOT_FOUND', path: req.originalUrl }));

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({ success: false, message, code: 'SERVER_ERROR', details: process.env.NODE_ENV === 'development' ? err.stack : undefined });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT} (${process.env.NODE_ENV || 'development'})`);
});

process.on('SIGTERM', () => { try { logsLimiter?.shutdown?.(); } catch (err) { console.error('Error shutting down limiter:', err); } server.close(() => process.exit(0)); });
process.on('SIGINT', () => { try { logsLimiter?.shutdown?.(); } catch (err) { console.error('Error shutting down limiter:', err); } server.close(() => process.exit(0)); });

export default app;
