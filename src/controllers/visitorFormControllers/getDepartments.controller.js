import { apiResponse, asyncHandler, Department } from "../../controllers/allImports.js";

const getDepartmentsForVForm = asyncHandler(async (request, response) => {

    const { plantId } = request.query;

    if (!plantId) {
        return response.status(400).json(
            new apiResponse(400, null, "Company ID is required")
        );
    }

    const departments = await Department.find({
        plant: plantId,
    }).populate("headOfDepartment", "fullname")
    .populate("departmentCreator", "fullname")
    .populate("company", "companyName")

    return response.status(200)
    .json(
        new apiResponse(200, departments, "Departments fetched sccessfully")
    )
});

export {getDepartmentsForVForm}