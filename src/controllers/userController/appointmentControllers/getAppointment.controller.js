import { apiError, apiResponse, Appointment, asyncHandler } from "../../allImports.js";

const getAppointment = asyncHandler(async (request, response) => {
    const {appointmentId} = request?.params;

    if(!appointmentId || appointmentId.trim() === ""){
        throw new apiError(400, "Appointment id is required")
    }

    const foundAppointment = await Appointment.findOne({appointmentId})
    .populate("plant", "plantName")
    .populate("personToVisit", "fullname")
    .populate("areaToVisit", "areaName")
    .populate("appointmentCreator", "fullname")

    if(!foundAppointment){
        throw new apiError(404, "Appointment not found, maybe expired")
    }

    if(foundAppointment.appointmentStatus === "Rejected"){
        throw new apiError(400, "This appointment is rejected")
    }

    if(!foundAppointment.isAppointmentActive || foundAppointment.checkedInTime){
        throw new apiError(400, "This appointment is expired")
    }

    return response.status(200)
    .json(
        new apiResponse(200, foundAppointment, "Appointment fetched successfully")
    )

});

export {getAppointment}