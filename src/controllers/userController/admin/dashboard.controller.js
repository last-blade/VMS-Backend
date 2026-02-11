import mongoose from "mongoose";
import { apiResponse, Appointment, asyncHandler } from "../../allImports.js";

const dashboard = asyncHandler(async (request, response) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const totalPassIssued = await Appointment.aggregate([
    {
      $match: {
        plant: new mongoose.Types.ObjectId(request.user.plant),
        appointmentPassType: "RED" || "GREEN" || "PURPLE",
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      },
    },

    {
      $count: "totalVisitorsPassIssued",
    },
  ]);

  const totalVisitorsInsideCompany = await Appointment.aggregate([
    {
      $match: {
        plant: new mongoose.Types.ObjectId(request.user.plant),
        isAppointmentActive: true,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      },
    },

    {
      $count: "visitorsInsideCompany",
    },
  ]);

  const totalCheckedInVisitors = await Appointment.aggregate([
    {
      $match: {
        plant: new mongoose.Types.ObjectId(request.user.plant),
        checkedInTime: { $exists: true, $ne: null },
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      },
    },

    {
      $count: "checkedInVisitors",
    },
  ]);

  const totalCheckedOutVisitors = await Appointment.aggregate([
    {
      $match: {
        plant: new mongoose.Types.ObjectId(request.user.plant),
        checkedOutTime: { $exists: true, $ne: null },
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      },
    },

    {
      $count: "checkedOutVisitors",
    },
  ]);

  const totalAppointments = await Appointment.aggregate([
    {
      $match: {
        plant: new mongoose.Types.ObjectId(request.user.plant),
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      },
    },

    {
      $count: "totalAppointments",
    },
  ]);

  const pendingAppointments = await Appointment.aggregate([
    {
      $match: {
        plant: new mongoose.Types.ObjectId(request.user.plant),
        appointmentPassType: {
          $exists: true,
          $ne: ["RED", "GREEN", "PURPLE", "REJECT"],
        },
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      },
    },

    {
      $count: "totalPendingAppointments",
    },
  ]);

  let dashboardData = {};

  dashboardData.totalPassIssued = totalPassIssued;
  dashboardData.totalVisitorsInsideCompany = totalVisitorsInsideCompany;
  dashboardData.totalCheckedInVisitors = totalCheckedInVisitors;
  dashboardData.totalCheckedOutVisitors = totalCheckedOutVisitors;
  dashboardData.totalAppointments = totalAppointments;
  dashboardData.pendingAppointments = pendingAppointments;

  return response
    .status(200)
    .json(new apiResponse(200, dashboardData, "Fetched"));
});

export { dashboard };
