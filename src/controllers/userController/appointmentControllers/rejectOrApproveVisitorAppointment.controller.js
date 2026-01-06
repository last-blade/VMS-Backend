import { sendWhatsAppTemplate } from "../../../services/whatsapp/whatsapp.service.js";
import { apiError, apiResponse, Appointment, asyncHandler, isObjectIdValid } from "../../allImports.js";

const rejectOrApproveVisitorAppointment = asyncHandler(async (request, response) => {
    const {appointmentStatus, appointmentId} = request.body;

    if(!appointmentStatus || appointmentStatus.trim() === undefined){
        throw new apiError(400, "Approval or rejection status is required")
    }

    if(!isObjectIdValid(appointmentId)){
        throw new apiError(400, "Appointment ID is invalid")
    }

    const foundAppointment = await Appointment.findById(appointmentId);

    if(!foundAppointment){
        throw new apiError(404, "Apointment not found")
    }

    if(appointmentStatus === "Approved"){
        foundAppointment.isAppointmentActive = true;

        const visitorName = foundAppointment.visitors[1].fullname;
        const phone = foundAppointment.visitors[0].mobile;
        await sendWhatsAppTemplate({
            to: phone,
            messages: [
            visitorName || "User",
            appointmentId,
            ],
            templateName: "vms_appointment_approved",
            languageCode: "en",
        });
    }

    foundAppointment.appointmentStatus = appointmentStatus;
    foundAppointment.save({validateBeforeSave: false});

    return response.status(200)
    .json(
        new apiResponse(200, {}, `Appointment ${appointmentStatus}`)
    )

});

export {rejectOrApproveVisitorAppointment}