import { Appointment } from "../../models/appointment.model.js";
import { sendWhatsAppTemplate } from "../whatsapp/whatsapp.service.js"; 

export async function approveOrRejectAppointment({ appointmentMongoId, appointmentStatus }) {
  const foundAppointment = await Appointment.findById(appointmentMongoId);
  if (!foundAppointment) throw new Error("Appointment not found");
console.log("foundAppointment", foundAppointment)
  // prevent double processing
    // prevent double processing (skip only if already finalized)
    if (["Approved", "Rejected"].includes(foundAppointment.appointmentStatus)) {
    return { skipped: true, status: foundAppointment.appointmentStatus };
    }


  if (appointmentStatus === "Approved") {
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
        templateName: "vms_appointment_approved",
        languageCode: "en",
        urlButton: {
          index: 0,
          param: foundAppointment.appointmentId,
        },
      });
    }
  } else if (appointmentStatus === "Rejected") {
    foundAppointment.isAppointmentActive = false;
  }

  foundAppointment.appointmentStatus = appointmentStatus;
  await foundAppointment.save({ validateBeforeSave: false });

  return { skipped: false, status: appointmentStatus };
}
