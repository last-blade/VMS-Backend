import { apiError, apiResponse, Appointment, asyncHandler, Plant } from "../../allImports.js";

const scanQrCode = asyncHandler(async (request, response) => {
    const { appointmentId } = request.params;
    const { qrData } = request.query;  // qrData will come only if QR is scanned

    let appointment;

    // CASE 1: QR SCAN
    if (qrData) {
        let plantId, companyId;
        try {
            ({ plantId, companyId } = JSON.parse(qrData));
        } catch (err) {
            throw new apiError(400, "Invalid QR data format");
        }

        // Step 1: Validate Plant
        const plant = await Plant.findOne({ _id: plantId, company: companyId });
        if (!plant) {
            throw new apiError(400, "Invalid QR code - plant not found or not linked to this company");
        }

        // Step 2: Find appointment linked to this plant
        appointment = await Appointment.findOne({
            plant: plantId,
            appointmentId: appointmentId || undefined,
        });

        if (!appointment) {
            return response.json(
                new apiResponse(
                    200,
                    { redirectTo: `/visitor-form/${plantId}` },
                    "No appointment found, redirect to visitor form"
                )
            );
        }
    } 

    // CASE 2: MANUAL CHECK-IN
    else if (appointmentId) {
        appointment = await Appointment.findOne({appointmentId});

        if (!appointment) {
            throw new apiError(404, "Appointment not found");
        }
    } 
    else {
        throw new apiError(400, "Either QR data or Appointment ID is required");
    }

    // Common validations
    const now = new Date();

    if (appointment.appointmentValidTill && appointment.appointmentValidTill < now) {
        throw new apiError(400, "This appointment has expired. Please request another pass.");
    }

    if (appointment.checkedOutTime) {
        throw new apiError(400, "You already checked out. Request a new pass.");
    }

    if (appointment.checkedInTime && !appointment.checkedOutTime) {
        return response.json(new apiResponse(200, appointment, "Already checked in"));
    }

    // New check-in
    appointment.checkedInTime = now;
    appointment.isAppointmentActive = true;
    appointment.appointmentStatus = "Approved",
    await appointment.save({ validateBeforeSave: false });

    return response.json(new apiResponse(200, appointment, "Checked in successfully"));
});

export { scanQrCode };
