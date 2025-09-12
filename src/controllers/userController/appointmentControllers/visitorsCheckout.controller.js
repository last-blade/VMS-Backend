import { apiError, apiResponse, Appointment, asyncHandler, isObjectIdValid } from "../../allImports.js";

const visitorsCheckout = asyncHandler(async (request, response) => {
    const {appointmentId} = request.params;

    const checkoutDate = new Date();

    if(!isObjectIdValid(appointmentId)){
        throw new apiError(400, "Appointment ID is invalid")
    }

    const foundAppointment = await Appointment.findById(appointmentId);

    if (!foundAppointment) {
        throw new apiError(404, "Appointment not found");
    }

    if (foundAppointment.appointmentValidTill && foundAppointment.appointmentValidTill < checkoutDate) {
        throw new apiError(400, "Visitor pass validity is already over");
    }


    if(foundAppointment.checkedOutTime){
        throw new apiError(400, "Already checked out")
    }

    if(foundAppointment.appointmentStatus === "Rejected"){
        throw new apiError(400, "This visitor pass is rejected")
    }

    if(foundAppointment.isAppointmentActive === false){
        throw new apiError(400, "Visitor pass is expired")
    }

    await Appointment.findByIdAndUpdate(appointmentId, {
        $set: {
            checkedOutTime: checkoutDate,
            isAppointmentActive: false,
        }
    }, {new: true});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Checked-out successfully")
    )

});

export {visitorsCheckout}