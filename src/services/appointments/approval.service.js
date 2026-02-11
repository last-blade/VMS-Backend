import { Appointment } from "../../models/appointment.model.js";
import { sendWhatsAppTemplate } from "../whatsapp/whatsapp.service.js"; 

export async function approveOrRejectAppointment({ appointmentMongoId, appointmentPassType }) {
  const foundAppointment = await Appointment.findById(appointmentMongoId);
  if (!foundAppointment) throw new Error("Appointment not found");
console.log("foundAppointment", foundAppointment)
  // prevent double processing
    // prevent double processing (skip only if already finalized)
    if (["RED", "GREEN", "PURPLE", "REJECTED"].includes(foundAppointment.appointmentPassType)) {
    return { skipped: true, status: foundAppointment.appointmentPassType };
    }


  if (appointmentPassType === "RED" || appointmentPassType === "GREEN" || appointmentPassType === "PURPLE") {
    foundAppointment.isAppointmentActive = true;

    // safer indexing
    const v0 = foundAppointment.visitors?.[0];
    const visitorName = v0?.fullname || "User";
    const phone = v0?.mobile;

    if (phone) {
      await sendWhatsAppTemplate({
        to: String(phone),
        messages: [
          visitorName,
          foundAppointment.appointmentId, // this is your APT-xxxx id
        ],
        templateName: "vms_appointment_approved_v3",
        languageCode: "en",
        urlButton: {
          index: 0,
          param: foundAppointment.appointmentId,
        },
      });
    }
  } else if (appointmentPassType === "REJECTED") {
    foundAppointment.isAppointmentActive = false;
    const v0 = foundAppointment.visitors?.[0];
    const visitorName = v0?.fullname || "User";
    const phone = v0?.mobile;
      await sendWhatsAppTemplate({
        to: String(phone),
        messages: [
          visitorName,
          foundAppointment.appointmentId, // this is your APT-xxxx id
          "Can't meet right now"
        ],
        templateName: "vms_appointment_rejected",
        languageCode: "en",
      });
  }

  foundAppointment.appointmentPassType = appointmentPassType;
  await foundAppointment.save({ validateBeforeSave: false });

  return { skipped: false, status: appointmentPassType };
}
