import { apiError, apiResponse, asyncHandler, Department, isObjectIdValid } from "../../../allImports.js";

const editDepartment = asyncHandler(async (request, response) => {
    const {departmentName, headOfDepartment} = request.body;
    const {departmentId} = request.params;

    if(!isObjectIdValid(departmentId)){
        throw new apiError(400, "Department ID is not valid")
    }

    const foundDepartment = await Department.findById(departmentId);

    if(!foundDepartment){
        throw new apiError(404, "Department not found, maybe deleted")
    }

    if(departmentName === undefined || departmentName.trim() === ""){
        throw new apiError(400, "Department name is required")
    }

    if(headOfDepartment){
        if(!isObjectIdValid(headOfDepartment)){
            throw new apiError(400, "HOD ID is invalid")
        }
    }

    const isDepartmentExist = await Department.findOne({
        departmentName,
        company: request.user.company,
    })

    if(isDepartmentExist){
        throw new apiError(400, "Department name already exist in your company")
    }

    await Department.findByIdAndUpdate(departmentId, {
        $set: {
            departmentName,
            headOfDepartment,
        }
    }, {new: true});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Department updated successfully")
    ) 
});

export {editDepartment}