const axios = require("axios");

const fetchAppointmentFromLegacy = async (appointmentId) => {

    try{

        console.log("Fetching appointment from Adapter Layer...");

        return {
            appointment_id: appointmentId,
            patient_id: 101,
            status: "scheduled"
        };

    }catch(error){

        console.log(error);

        return null;

    }

};

module.exports = {
    fetchAppointmentFromLegacy
};