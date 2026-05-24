const queueModel = require("../models/queueModel");

const adapterService = require("../services/adapterService");

const notificationService =
    require("../services/notificationService");

const generateQueue = async (req, res) => {

    const { appointment_id } = req.body;

    const appointmentData =
        await adapterService.fetchAppointmentFromLegacy(
            appointment_id
        );

    if(!appointmentData){

        return res.status(500).json({
            success: false,
            message: "Failed to fetch appointment from Adapter Layer"
        });

    }

    const patient_id = appointmentData.patient_id;

    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const randomNumber = Math.floor(Math.random() * 900) + 100;

    const queue_number = `Q-${year}${month}${day}-${randomNumber}`;

    queueModel.createQueue(
        appointment_id,
        patient_id,
        queue_number,
        (err, result) => {

            if(err){
                return res.status(500).json({
                    success: false,
                    message: "Failed to generate queue",
                    error: err
                });
            }

            res.status(201).json({
                success: true,
                message: "Queue generated successfully through Adapter Layer",
                queue_number: queue_number
            });

        }
    );

};

const getPendingQueues = (req, res) => {

    queueModel.getPendingQueues((err, results) => {

        if(err){
            return res.status(500).json({
                success: false,
                message: "Failed to fetch pending queues",
                error: err
            });
        }

        res.status(200).json({
            success: true,
            queues: results
        });

    });

};

const callQueue = (req, res) => {

    const { id } = req.params;

    queueModel.callQueue(id, async (err, result) => {

        if(err){
            return res.status(500).json({
                success: false,
                message: "Failed to call queue",
                error: err
            });
        }

        await notificationService.sendNotification({
            patient_id: 101,
            queue_number: `QUEUE-${id}`
        });

        res.status(200).json({
            success: true,
            message: "Queue is now ongoing and notification sent"
        });

    });

};

const getOngoingQueues = (req, res) => {

    queueModel.getOngoingQueues((err, results) => {

        if(err){
            return res.status(500).json({
                success: false,
                message: "Failed to fetch ongoing queues",
                error: err
            });
        }

        res.status(200).json({
            success: true,
            queues: results
        });

    });

};

const completeQueue = (req, res) => {

    const { id } = req.params;

    queueModel.completeQueue(id, (err, result) => {

        if(err){
            return res.status(500).json({
                success: false,
                message: "Failed to complete queue",
                error: err
            });
        }

        res.status(200).json({
            success: true,
            message: "Queue completed successfully"
        });

    });

};

module.exports = {
    generateQueue,
    getPendingQueues,
    callQueue,
    getOngoingQueues,
    completeQueue
};