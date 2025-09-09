import mongoose from "mongoose";
import { apiResponse, asyncHandler, Role } from "../../../allImports.js";

const getRoles = asyncHandler(async (request, response) => {
    const roles = await Role.aggregate([
        {
            $match: {
                company: new mongoose.Types.ObjectId(request.user.company)
            }
        },

        {
            $project: {
                company: 0,
                roleCreator: 0,
                __v: 0,
            }
        },
    ]);

    return response.status(200)
    .json(
        new apiResponse(200, {roles: roles}, "Company roles fetched successfully")
    )

});

export {getRoles}