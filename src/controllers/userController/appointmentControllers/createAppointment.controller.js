import { apiError, apiResponse, Appointment, asyncHandler, isObjectIdValid } from "../../allImports.js";

const createAppointment = asyncHandler(async (request, response) => {
    const {plant, department, personToVisit, areaToVisit, appointmentDate, appointmentValidTill, purposeOfVisit, visitors} = request.body;

    if([plant, department, personToVisit, areaToVisit].some(input => !isObjectIdValid(input))){
        throw new apiError(400, "One or more Object IDs are invalid");
    }

    if([appointmentDate, appointmentValidTill, purposeOfVisit].some(input => input === undefined || input.trim() === "")){
        throw new apiError(400, "Fill in required fields")
    }

    if (!Array.isArray(visitors) || visitors.length === 0) {
        throw new apiError(400, "At least one visitor is required");
    }

    visitors.forEach((v, index) => {
        if (!v.mobile || !v.fullname) {
            throw new apiError(400, `Visitor ${index + 1}: mobile and fullname are required`);
        }
    });

    await Appointment.create({
        plant,
        department,
        personToVisit,
        areaToVisit,
        appointmentDate,
        appointmentValidTill,
        purposeOfVisit,
        visitors,
        appointmentCreator: request.user.id,
    });

    return response.status(201)
    .json(
        new apiResponse(201, {}, "Appointment created successfully")
    )

});

export {createAppointment}