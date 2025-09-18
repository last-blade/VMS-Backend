import { apiError, apiResponse, Appointment, asyncHandler } from "../../allImports.js";

const getUserNameByAppointmentId = asyncHandler(async (request, response) => {

    const {appointmentId} = request.params;

    const appointmentDetail = await Appointment.findOne({
        appointmentId,
    });

    if(!appointmentDetail){
        throw new apiError(404, "Appointment not found for this appointment id")
    }

    let visitorDetails = appointmentDetail.visitors;

    return response.status(200)
    .json(
        new apiResponse(200, {visitorDetails: visitorDetails}, "Visitor details fetched successfully")
    )

});

export {getUserNameByAppointmentId}