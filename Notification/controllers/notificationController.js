//controller

import NotificationLog from '../models/NotificationLog.js';
import { sendEmail } from '../config/mailer.js';

export const processNotification = async (req, res) => {
  try {

    const { senderSystem: providedSenderSystem, recipientEmail, subject, message } = req.body;

    if (!recipientEmail || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Adapter Layer: Missing required fields in forwarded request',
        code: 'MISSING_FIELDS',
        required: ['recipientEmail', 'subject', 'message'],
        received: { recipientEmail, subject, message },
      });
    }

    let senderSystem = 'Unknown System';
    
    if (providedSenderSystem && providedSenderSystem.trim()) {

      senderSystem = providedSenderSystem;
      console.log(`[Adapter Layer] Using provided sender system: ${senderSystem}`);
    } else if (req.user && req.user.role) {

      const role = req.user.role;
      if (role === 'Doctor') senderSystem = 'Doctor Portal';
      else if (role === 'Patient') senderSystem = 'Patient Portal';
      else if (role === 'Admin') senderSystem = 'Admin System';
      else senderSystem = `${role} System`;
      console.log(`[Adapter Layer] Auto-detected sender system from token role: ${senderSystem}`);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Adapter Layer: Invalid email format in forwarded request',
        code: 'INVALID_EMAIL',
        recipientEmail,
      });
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const duplicateRecord = await NotificationLog.findOne({
      recipientEmail: recipientEmail.toLowerCase(),
      message,
      status: { $in: ['Sent', 'Duplicate'] },
      createdAt: { $gte: fiveMinutesAgo },
    });

    if (duplicateRecord) {

      await NotificationLog.create({
        senderSystem,
        recipientEmail: recipientEmail.toLowerCase(),
        subject,
        message,
        status: 'Duplicate',
      });

      console.log(
        `[Adapter Layer] ⚠ Duplicate notification detected for ${recipientEmail}. Original sent at ${duplicateRecord.createdAt}`
      );

      return res.status(409).json({
        success: false,
        message: 'Adapter Layer: Duplicate notification detected. This exact message was already sent to this recipient within the last 5 minutes.',
        code: 'DUPLICATE_NOTIFICATION',
        originalNotificationTime: duplicateRecord.createdAt,
        recipientEmail,
        senderSystem,
      });
    }

    let emailSent = false;
    let sendEmailError = null;

    try {
      await sendEmail(recipientEmail, subject, message);
      emailSent = true;
      console.log(`[Adapter Layer] ✅ Email sent successfully via ${senderSystem} to ${recipientEmail}`);
    } catch (error) {
      sendEmailError = error.message;
      console.error(`[Adapter Layer] ❌ Email sending failed for ${senderSystem}:`, sendEmailError);
    }

    const notificationLog = await NotificationLog.create({
      senderSystem,
      senderEmail: req.user && req.user.email ? req.user.email.toLowerCase() : null,
      recipientEmail: recipientEmail.toLowerCase(),
      subject,
      message,
      status: emailSent ? 'Sent' : 'Failed',
      errorDetails: sendEmailError,
    });

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Adapter Layer: Failed to send notification email on behalf of sender system',
        code: 'EMAIL_SEND_FAILED',
        senderSystem,
        details: sendEmailError,
        logId: notificationLog._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Adapter Layer: Notification forwarded and sent successfully',
      code: 'NOTIFICATION_SENT',
      data: {
        logId: notificationLog._id,
        senderSystem,
        recipientEmail,
        sentAt: notificationLog.createdAt,
      },
    });
  } catch (error) {
    console.error('[Adapter Layer] Unexpected error in processNotification:', error);

    try {
      const { senderSystem, recipientEmail, subject, message } = req.body;
      if (recipientEmail) {
        await NotificationLog.create({
          senderSystem: senderSystem || 'Unknown',
          recipientEmail: recipientEmail.toLowerCase(),
          subject: subject || 'N/A',
          message: message || 'N/A',
          status: 'Failed',
          errorDetails: error.message,
        });
      }
    } catch (dbError) {
      console.error('Failed to log error to database:', dbError.message);
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error while processing notification',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Contact support if this persists',
    });
  }
};

export const getNotificationLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = {};

    if (status) query.status = status;

    const user = req.user;

    if (!user || !user.role) {
      query.recipientEmail = 'unauthorized_access'; 
    } 

    else if (user.role?.toLowerCase() === 'patient') {
      if (!user.email) {
        return res.status(400).json({ success: false, message: "Token payload missing 'email' for patient validation." });
      }
      query.recipientEmail = user.email.toLowerCase();
    } 

    else if (user.role?.toLowerCase() === 'doctor') {
      if (!user.email) {
        return res.status(400).json({ success: false, message: "Token payload missing 'email' for doctor validation." });
      }
      query.senderEmail = user.email.toLowerCase();
    } 

    else if (user.role?.toLowerCase() === 'admin') {
      if (req.query.recipientEmail) {
        query.recipientEmail = req.query.recipientEmail.toLowerCase();
      }
    }

    const logs = await NotificationLog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const totalCount = await NotificationLog.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching notification logs:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notification logs',
      code: 'FETCH_LOGS_ERROR',
      details: error.message,
    });
  }
};