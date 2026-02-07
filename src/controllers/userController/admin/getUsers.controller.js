import { apiResponse, asyncHandler, User } from "../../allImports.js";

const getUsers = asyncHandler(async(request, response) => {
    const { plantId } = request.query;
    const limit = parseInt(request.query.limit) || 10;
    const page = parseInt(request.query.page) || 1;
    const skip = (page - 1) * limit;

    const filterplantId = plantId || request.user?.plant;

    if (!filterplantId) {
        return response.status(400).json(
            new apiResponse(400, null, "Plant ID is required")
        );
    }
    const users = await User.find({
        plant: filterplantId,
    }).populate("department", "departmentName")
    .populate("company", "companyName")
    .populate("plant", "plantName")
    .populate("role", "roleName").skip(skip).limit(limit);

    const totalUser = await User.countDocuments({
        plant: filterplantId,
    });

    return response.status(200)
    .json(
        new apiResponse(200, users, "Users fetched successfully")
    )

});

export {getUsers}