import { apiError, apiResponse, asyncHandler, Department, isObjectIdValid } from "../../../allImports.js";

const createDeparment = asyncHandler(async (request, response) => {
    const {departmentName, headOfDepartment} = request.body;

    if(departmentName.trim() === "" || departmentName === undefined){
        throw new apiError(400, "Department name is required")
    }

    if(!isObjectIdValid(headOfDepartment)){
        throw new apiError(400, "HOD ID is invalid")
    }

    await Department.create({
        departmentName,
        departmentCreator: request.user.id,
        headOfDepartment,
        company: request.user.company,
    });

    return response.status(201)
    .json(
        new apiResponse(201, {}, "Department created successfully")
    )

});

export {createDeparment}