import mongoose from "mongoose";
import { apiResponse, Appointment, asyncHandler } from "../../allImports.js";

const dashboard = asyncHandler(async (request, response) => {

    const totalPassIssued = await Appointment.aggregate([
        {
            $match: {
                plant: new mongoose.Types.ObjectId(request.user.plant),
                appointmentStatus: "Approved"
            }
        },

        {
            $count: "totalVisitorsPassIssued"
        },
    ]);

    const totalVisitorsInsideCompany = await Appointment.aggregate([
        {
            $match: {
                plant: new mongoose.Types.ObjectId(request.user.plant),
                isAppointmentActive: true
            }
        },

        {
            $count: "visitorsInsideCompany"
        },
    ]);

    const totalCheckedInVisitors = await Appointment.aggregate([
        {
            $match: {
                plant: new mongoose.Types.ObjectId(request.user.plant),
                 checkedInTime: { $exists: true, $ne: null }
            }
        },

        {
            $count: "checkedInVisitors"
        },
    ]);

    const totalCheckedOutVisitors = await Appointment.aggregate([
        {
            $match: {
                plant: new mongoose.Types.ObjectId(request.user.plant),
                checkedOutTime: { $exists: true, $ne: null }
            }
        },

        {
            $count: "checkedOutVisitors"
        },
    ]);

    const totalAppointments = await Appointment.aggregate([
        {
            $match: {
                plant: new mongoose.Types.ObjectId(request.user.plant),
            }
        },

        {
            $count: "totalAppointments"
        },
    ]);

    const pendingAppointments = await Appointment.aggregate([
        {
            $match: {
                plant: new mongoose.Types.ObjectId(request.user.plant),
                appointmentStatus: {$exists: true, $ne: ["Rejected", "Approved"]}
            }
        },

        {
            $count: "totalPendingAppointments"
        },
    ]);


    let dashboardData = {};

    dashboardData.totalPassIssued = totalPassIssued;
    dashboardData.totalVisitorsInsideCompany = totalVisitorsInsideCompany;
    dashboardData.totalCheckedInVisitors = totalCheckedInVisitors;
    dashboardData.totalCheckedOutVisitors = totalCheckedOutVisitors;
    dashboardData.totalAppointments = totalAppointments;
    dashboardData.pendingAppointments = pendingAppointments;

    return response.status(200)
    .json(
        new apiResponse(200, dashboardData, "Fetched")
    )
});

export {dashboard}