import { apiResponse, asyncHandler, User } from "../../allImports.js";

const getUsers = asyncHandler(async(request, response) => {
    const { plantId } = request.query;

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
    .populate("role", "roleName");

    return response.status(200)
    .json(
        new apiResponse(200, users, "Users fetched successfully")
    )

});

export {getUsers}