import { apiResponse, asyncHandler, Department } from "../../../allImports.js";

const getDepartments = asyncHandler(async (request, response) => {
    const departments = await Department.find({
        company: request.user.company,
    }).populate("headOfDepartment", "fullname")
    .populate("departmentCreator", "fullname")

    return response.status(200)
    .json(
        new apiResponse(200, departments, "Departments fetched sccessfully")
    )
});

export {getDepartments}