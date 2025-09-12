import { apiError, apiResponse, Appointment, asyncHandler, Plant } from "../../allImports.js";

const scanQrCode = asyncHandler(async (request, response) => {
    const { qrData, appointmentId } = request.params;
    const { plantId, companyId } = JSON.parse(qrData);

    //Step 1: Validate Plant
    const plant = await Plant.findOne({ 
        _id: plantId, 
        company: companyId 
    });

    if (!plant) {
        throw new apiError(400, "Invalid QR code - plant not found or not linked to this company");
    }

    //Step 2: Validate Appointment
    const appointment = await Appointment.findOne({
        _id: appointmentId,
        plant: plantId,
    });

    if (!appointment) {
        // Case 2: New Visitor
        return response.json(
            new apiResponse(
                200,
                { redirectTo: `/visitor-form/${plantId}` },
                "No appointment found, redirect to visitor form"
            )
        );
    }

    //Step 3: Add extra conditions
    const now = new Date();

    // (i) If appointment is expired
    if (appointment.appointmentValidTill && appointment.appointmentValidTill < now) {
        throw new apiError(400, "This appointment has expired. Please request another pass.");
    }

    // (ii) If already checked out
    if (appointment.checkedOutTime) {
        throw new apiError(400, "You already checked out. Request a new pass.");
    }

    // (iii) If already checked in
    if (appointment.checkedInTime && !appointment.checkedOutTime) {
        return response.json(
            new apiResponse(200, appointment, "Already checked in")
        );
    }

    //Step 4: Fresh check-in
    appointment.checkedInTime = now;
    await appointment.save({ validateBeforeSave: false });

    return response.json(new apiResponse(200, appointment, "Checked in successfully"));
});

export { scanQrCode };
