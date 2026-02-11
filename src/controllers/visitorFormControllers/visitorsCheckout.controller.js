import { sendWhatsAppTemplate } from "../../services/whatsapp/whatsapp.service.js";
import {
  apiError,
  apiResponse,
  Appointment,
  asyncHandler,
  isObjectIdValid,
} from "../allImports.js";

const visitorsCheckout = asyncHandler(async (request, response) => {
  const { appointmentId } = request.params;

  const checkoutDate = new Date();

  if (!appointmentId || appointmentId.trim() === "") {
    throw new apiError(400, "Appointment ID is required");
  }

  const foundAppointment = await Appointment.findOne({ appointmentId });

  if (!foundAppointment) {
    throw new apiError(404, "Appointment not found");
  }

  if (
    foundAppointment.appointmentValidTill &&
    foundAppointment.appointmentValidTill < checkoutDate
  ) {
    throw new apiError(400, "Visitor pass validity is already over");
  }

  if (foundAppointment.checkedOutTime) {
    throw new apiError(400, "Already checked out");
  }

  if (foundAppointment.appointmentPassType === "REJECTED") {
    throw new apiError(400, "This visitor pass is rejected");
  }

  if (foundAppointment.isAppointmentActive === false) {
    throw new apiError(400, "Visitor pass is expired");
  }

  const appointment = await Appointment.findOneAndUpdate(
    { appointmentId },
    {
      $set: {
        checkedOutTime: checkoutDate,
        isAppointmentActive: false,
      },
    },
    { new: true },
  ).populate("personToVisit", "fullname mobile");

  const v0 = appointment.visitors[0];
  const visitorName = v0?.fullname;
  // const visitorMobile = v0?.mobile;
  // const visitorsCompany = v0?.company;
  const checkOutTime = appointment?.checkedOutTime;
  const hostName = appointment.personToVisit.fullname;
  const whatsappResponse = await sendWhatsAppTemplate({
    to: appointment.personToVisit.mobile,
    messages: [hostName || "Host", visitorName, appointmentId, checkOutTime],
    templateName: "vms_host_checkout_alert",
    languageCode: "en",
  });

  return response
    .status(200)
    .json(new apiResponse(200, {}, "Checked-out successfully"));
});

export { visitorsCheckout };
