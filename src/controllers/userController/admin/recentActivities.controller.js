import mongoose from "mongoose";
import { apiResponse, Appointment, asyncHandler } from "../../allImports.js";

const recentActivities = asyncHandler(async (request, response) => {

  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 10;
  const skip = (page - 1)*limit;

    const checkedinActivities = await Appointment.aggregate([
      {
        $match: {
            plant: new mongoose.Types.ObjectId(request.user.plant),
            checkedInTime: {$exists: true, $ne: null},
        }
      },

      {
        $project: {
            visitors: 1,
            updatedAt: 1,
        }
      }, 

      {
        $skip: skip,
      },

      {
        $limit: limit,
      }

    ])

    const checkedOutActivities = await Appointment.aggregate([
      {
        $match: {
            plant: new mongoose.Types.ObjectId(request.user.plant),
            checkedOutTime: {$exists: true, $ne: null},
        }
      },

      {
        $project: {
            visitors: 1,
            updatedAt: 1,
        }
      },    

      {
        $skip: skip,
      },

      {
        $limit: limit,
      }

    ]);

    const totalCheckedIn = await Appointment.countDocuments({
      plant: new mongoose.Types.ObjectId(request.user.plant),
      checkedInTime: {$exists: true, $ne: null},
    });

    const totalCheckedOut = await Appointment.countDocuments({
      plant: new mongoose.Types.ObjectId(request.user.plant),
      checkedOutTime: {$exists: true, $ne: null},
    });

    return response.status(200)
    .json(
        new apiResponse(200, {
            page,
            totalPages: Math.ceil((totalCheckedIn+totalCheckedOut)/limit),
            totalActivities: (totalCheckedIn+totalCheckedOut),
            checkedinActivities,
            checkedOutActivities,
        }, "Activities fetched successfully")
    )
});

export {recentActivities}