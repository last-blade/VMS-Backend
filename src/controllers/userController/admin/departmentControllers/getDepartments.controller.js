import { apiResponse, asyncHandler, Department } from "../../../allImports.js";

const getDepartments = asyncHandler(async (request, response) => {

    const { companyId } = request.query;

    const filterCompanyId = companyId || request.user?.company;

    if (!filterCompanyId) {
        return response.status(400).json(
            new apiResponse(400, null, "Company ID is required")
        );
    }

    const departments = await Department.find({
        company: filterCompanyId,
    }).populate("headOfDepartment", "fullname")
    .populate("departmentCreator", "fullname")
    .populate("company", "companyName")

    return response.status(200)
    .json(
        new apiResponse(200, departments, "Departments fetched sccessfully")
    )
});

export {getDepartments}