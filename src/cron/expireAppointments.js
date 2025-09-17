import { Appointment } from "../models/appointment.model.js"
import { apiResponse } from "../utils/apiResponse.js";
import cron from "node-cron";

const expireAppointments = async() => {

    const today = new Date();
    await Appointment.updateMany(
        { 
            appointmentValidTill: { 
                $lt: today 
            }, 
            isAppointmentActive: true 
        },

        { 
            $set: { 
                isAppointmentActive: false 
            } 
        }
    );
};

cron.schedule("* * * * * *", () => {
    expireAppointments();
})
