import { sendWhatsAppTemplate } from "../../../services/whatsapp/whatsapp.service.js";
import {
  apiError,
  apiResponse,
  Appointment,
  asyncHandler,
  isObjectIdValid,
} from "../../allImports.js";

const rejectOrApproveVisitorAppointment = asyncHandler(
  async (request, response) => {
    const { appointmentPassType, appointmentId } = request.body;

    if (!appointmentPassType || appointmentPassType.trim()) {
      throw new apiError(400, "Approval or rejection status is required");
    }

    if (!isObjectIdValid(appointmentId)) {
      throw new apiError(400, "Appointment ID is invalid");
    }

    const foundAppointment = await Appointment.findById(appointmentId);

    if (!foundAppointment) {
      throw new apiError(404, "Apointment not found");
    }

    if (appointmentPassType === "RED" || appointmentPassType === "GREEN" || appointmentPassType === "PURPLE") {
      foundAppointment.isAppointmentActive = true;

      const visitorName = foundAppointment.visitors[1].fullname;
      const phone = foundAppointment.visitors[0].mobile;
      await sendWhatsAppTemplate({
        to: phone,
        messages: [visitorName || "User", appointmentId],
        templateName: "vms_appointment_approved_v3",
        languageCode: "en",
        urlButton: {
          index: 0, // first button
          param: encodeURIComponent(appointmentId), // only the dynamic part
        },
      });
    }

    foundAppointment.appointmentPassType = appointmentPassType;
    await foundAppointment.save({ validateBeforeSave: false });

    return response
      .status(200)
      .json(new apiResponse(200, {}, `Appointment ${appointmentPassType}`));
  },
);

export { rejectOrApproveVisitorAppointment };
