import { apiResponse, asyncHandler, User } from "../../allImports.js";

const getUsers = asyncHandler(async(request, response) => {
    const { companyId } = request.query;

    const filterCompanyId = companyId || request.user?.company;

    if (!filterCompanyId) {
        return response.status(400).json(
            new apiResponse(400, null, "Company ID is required")
        );
    }
    const users = await User.find({
        company: filterCompanyId,
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