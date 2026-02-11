import { Appointment } from "../../models/appointment.model.js";
import { sendWhatsAppTemplate } from "../whatsapp/whatsapp.service.js";

export async function approveOrRejectAppointment({ appointmentMongoId, appointmentPassType }) {
  const foundAppointment = await Appointment.findById(appointmentMongoId);
  if (!foundAppointment) throw new Error("Appointment not found");

  const passType = String(appointmentPassType || "").trim().toUpperCase();

  // ✅ prevent double processing: if already decided, ignore further clicks
  if (foundAppointment.appointmentPassType) {
    return { skipped: true, passType: foundAppointment.appointmentPassType };
  }

  const v0 = foundAppointment.visitors?.[0];
  const visitorName = v0?.fullname || "User";
  const phone = v0?.mobile;

  if (!phone) throw new Error("Visitor mobile missing");

  // APPROVE-like flow for RED/GREEN/PURPLE
  if (["RED", "GREEN", "PURPLE"].includes(passType)) {
    foundAppointment.isAppointmentActive = true;
    foundAppointment.appointmentPassType = passType;

    // send approved pass to visitor
    await sendWhatsAppTemplate({
      to: String(phone),
      messages: [
        visitorName,
        foundAppointment.appointmentId,
      ],
      templateName: "vms_appointment_approved_v3",
      languageCode: "en",
      urlButton: {
        index: 0,
        param: foundAppointment.appointmentId,
      },
    });
  }

  //REJECT flow
  else if (passType === "REJECT") {
    foundAppointment.isAppointmentActive = false;
    foundAppointment.appointmentPassType = "REJECT";

    await sendWhatsAppTemplate({
      to: String(phone),
      messages: [
        visitorName,
        foundAppointment.appointmentId,
        "Can't meet right now",
      ],
      templateName: "vms_appointment_rejected",
      languageCode: "en",
    });
  }

  //unknown input
  else {
    return { skipped: true, reason: "unknown_pass_type", received: passType };
  }

  await foundAppointment.save({ validateBeforeSave: false });

  return {
    skipped: false,
    passType: foundAppointment.appointmentPassType,
    isActive: foundAppointment.isAppointmentActive,
  };
}
