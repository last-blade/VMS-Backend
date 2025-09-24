import mongoose from "mongoose";
import { apiResponse, Appointment, asyncHandler } from "../../allImports.js";

const recentActivities = asyncHandler(async (request, response) => {
    const checkedinActivities = await Appointment.aggregate([
      {
        $match: {
            company: new mongoose.Types.ObjectId(request.user.company),
            checkedInTime: {$exists: true, $ne: null},
        }
      },

      {
        $project: {
            visitors: 1,
            createdAt: 1,
        }
      }, 

      {
        $skip: 1,
      },

      {
        $limit: 10,
      }

    ])

    const checkedOutActivities = await Appointment.aggregate([
      {
        $match: {
            company: new mongoose.Types.ObjectId(request.user.company),
            checkedOutTime: {$exists: true, $ne: null},
        }
      },

      {
        $project: {
            visitors: 1,
            createdAt: 1,
        }
      },    

      {
        $skip: 1,
      },

      {
        $limit: 10,
      }

    ]);

    return response.status(200)
    .json(
        new apiResponse(200, {
            checkedinActivities,
            checkedOutActivities,
        }, "Activities fetched successfully")
    )
});

export {recentActivities}