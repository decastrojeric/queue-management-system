const axios = require("axios");

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5000";

const sendNotification = async (queueData) => {

    try{

        console.log("Sending notification...", queueData);

        // Try to call central Notification System if available
        try{
            // Try legacy-style endpoint first
            await axios.post(
                `${NOTIFICATION_SERVICE_URL}/api/notifications/send`,
                {
                    patient_id: queueData.patient_id,
                    queue_number: queueData.queue_number,
                    message: queueData.message || "Your queue is now being called."
                },
                { timeout: 3000 }
            );

            return true;

        }catch(err){
            // Try the adapter's notify endpoint (/api/notify)
            try{
                await axios.post(
                    `${NOTIFICATION_SERVICE_URL}/api/notify`,
                    {
                        patient_id: queueData.patient_id,
                        queue_number: queueData.queue_number,
                        message: queueData.message || "Your queue is now being called."
                    },
                    { timeout: 3000 }
                );
                return true;
            } catch (err2) {
                console.log("Notification service unavailable, logging locally.", err2.message || err2);
                // Graceful fallback to local logging
                console.log({
                    patient_id: queueData.patient_id,
                    queue_number: queueData.queue_number,
                    message: queueData.message || "Your queue is now being called."
                });
                return false;
            }
        }

    }catch(error){

        console.log(error);

        return false;

    }

};

module.exports = {
    sendNotification
};