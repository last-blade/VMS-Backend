import { apiError, apiResponse, asyncHandler, Department, isObjectIdValid } from "../../../allImports.js";

const deleteDepartment = asyncHandler(async (request, response) => {
    const {departmentId} = request.params;

    if(!isObjectIdValid(departmentId)){
        throw new apiError(400, "Department ID is not valid")
    }

    const foundDepartment = await Department.findById(departmentId);

    if(!foundDepartment){
        throw new apiError(404, "Department not found, maybe deleted")
    }

    if(foundDepartment.usageCount > 0){
        throw new apiError(400, "Cannot delete: department is still in use")
    }

    await Department.findByIdAndDelete(departmentId);

    foundDepartment.usageCount = usageCount - 1;
    foundDepartment.save({validateBeforeSave: false});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Department deleted successfully")
    )
});

export {deleteDepartment}