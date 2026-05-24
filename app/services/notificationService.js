const sendNotification = async (queueData) => {

    try{

        console.log("Sending notification...");

        console.log({
            patient_id: queueData.patient_id,
            queue_number: queueData.queue_number,
            message: "Your queue is now being called."
        });

        return true;

    }catch(error){

        console.log(error);

        return false;

    }

};

module.exports = {
    sendNotification
};