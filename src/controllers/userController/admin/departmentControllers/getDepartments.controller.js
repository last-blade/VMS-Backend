import { apiResponse, asyncHandler, Department } from "../../../allImports.js";

const getDepartments = asyncHandler(async (request, response) => {

    const { plantId } = request.query;

    const filterplantId = request.user?.plant;
console.log("PlantID", filterplantId);
    if (!filterplantId) {
        return response.status(400).json(
            new apiResponse(400, null, "Plant ID is required")
        );
    }

    const departments = await Department.find({
        plant: filterplantId,
    }).populate("headOfDepartment", "fullname")
    .populate("departmentCreator", "fullname")
    .populate("company", "companyName")

    return response.status(200)
    .json(
        new apiResponse(200, departments, "Departments fetched sccessfully")
    )
});

export {getDepartments}