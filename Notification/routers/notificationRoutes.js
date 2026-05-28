import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import rateLimiter from '../middleware/rateLimiter.js';
import { processNotification, getNotificationLogs } from '../controllers/notificationController.js';

const router = express.Router();

const limiter = rateLimiter();

router.post('/notify', authMiddleware, processNotification);

router.get('/notification-logs', limiter, authMiddleware, getNotificationLogs);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Notification service is running',
    timestamp: new Date(),
  });
});

export default router;
export { limiter };
