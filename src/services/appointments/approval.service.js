import { Appointment } from "../../models/appointment.model.js";
import { sendWhatsAppTemplate } from "../whatsapp/whatsapp.service.js";

export async function approveOrRejectAppointment({ appointmentMongoId, appointmentPassType }) {
  const foundAppointment = await Appointment.findById(appointmentMongoId);
  if (!foundAppointment) throw new Error("Appointment not found");

  const passType = String(appointmentPassType || "").trim().toUpperCase();

  // ✅ prevent double processing
  // if (foundAppointment.appointmentPassType) {
  //   return { skipped: true, status: foundAppointment.appointmentPassType };
  // }

  const v0 = foundAppointment.visitors?.[0];
  const visitorName = v0?.fullname || "User";
  const phone = v0?.mobile;
console.log("visitor phone", phone)
  if (!phone) throw new Error("Visitor mobile missing");

  if (["RED", "GREEN", "PURPLE", "PENDING"].includes(passType)) {
    foundAppointment.isAppointmentActive = true;
    foundAppointment.appointmentPassType = passType;
console.log("appointment", foundAppointment)
    const wa = await sendWhatsAppTemplate({
      to: String(phone),
      messages: [visitorName, foundAppointment.appointmentId],
      templateName: "vms_appointment_approved_v3",
      languageCode: "en",
      urlButton: { index: 0, param: foundAppointment.appointmentId },
    });

    console.log("APPROVED TEMPLATE SENT:", wa);
  } else if (passType === "REJECT") {
    foundAppointment.isAppointmentActive = false;
    foundAppointment.appointmentPassType = "REJECT";

    const wa = await sendWhatsAppTemplate({
      to: String(phone),
      messages: [visitorName, foundAppointment.appointmentId, "Can't meet right now"],
      templateName: "vms_appointment_rejected",
      languageCode: "en",
    });

    console.log("REJECT TEMPLATE SENT:", wa);
  } else {
    return { skipped: true, reason: "unknown_pass_type", received: passType };
  }

  await foundAppointment.save({ validateBeforeSave: false });
  return { skipped: false, status: foundAppointment.appointmentPassType };
}
