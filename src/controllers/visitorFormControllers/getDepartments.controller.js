import { apiResponse, asyncHandler, Department } from "../../controllers/allImports.js";

const getDepartmentsForVForm = asyncHandler(async (request, response) => {

    const { companyId } = request.query;

    if (!companyId) {
        return response.status(400).json(
            new apiResponse(400, null, "Company ID is required")
        );
    }

    const departments = await Department.find({
        company: companyId,
    }).populate("headOfDepartment", "fullname")
    .populate("departmentCreator", "fullname")
    .populate("company", "companyName")

    return response.status(200)
    .json(
        new apiResponse(200, departments, "Departments fetched sccessfully")
    )
});

export {getDepartmentsForVForm}