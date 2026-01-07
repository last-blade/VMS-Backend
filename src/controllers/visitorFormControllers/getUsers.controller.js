import { apiResponse, asyncHandler, User } from "../../controllers/allImports.js";

const getUsersForVForm = asyncHandler(async(request, response) => {
    const { companyId } = request.query;

    if (!companyId) {
        return response.status(400).json(
            new apiResponse(400, null, "Company ID is required")
        );
    }
    const users = await User.find({
        company: companyId,
    }).populate("department", "departmentName")
    .populate("company", "companyName")
    .populate("plant", "plantName")
    .populate("role", "roleName");

    return response.status(200)
    .json(
        new apiResponse(200, users, "Users fetched successfully")
    )

});

export {getUsersForVForm}