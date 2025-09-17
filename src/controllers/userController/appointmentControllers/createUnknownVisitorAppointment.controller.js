import { apiError, apiResponse, Appointment, asyncHandler, isObjectIdValid, Plant } from "../../allImports.js";

const createUnknownVisitorAppointment = asyncHandler(async (request, response) => {
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

    const foundPlant = await Plant.findById(plant).populate("company", "companyName");

    if(!foundPlant){
        throw new apiError(404, "Plant not found")
    }

    await Appointment.create({
        plant,
        department,
        personToVisit,
        areaToVisit,
        appointmentDate,
        appointmentValidTill,
        purposeOfVisit,
        visitors,
        company: foundPlant?.company.companyName,
    });

    return response.status(201)
    .json(
        new apiResponse(201, {}, "Appointment created successfully")
    )
})

export {createUnknownVisitorAppointment}