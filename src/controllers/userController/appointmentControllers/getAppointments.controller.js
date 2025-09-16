import { apiResponse, Appointment, asyncHandler } from "../../allImports.js";

const getAppointments = asyncHandler(async (request, response) => {
    const appointments = await Appointment.find({
        company: request.user.company
    }).populate("personToVisit", "fullname")
    .populate("department", "departmentName")
    .populate("areaToVisit", "areaName")
    .populate("appointmentCreator", "fullname");

    return response.status(200)
    .json(
        new apiResponse(200, appointments, "Appointments/Visitors fetched successfully")
    )

});

export {getAppointments}