import { apiError, apiResponse, asyncHandler, Role } from "../../../allImports.js";

const deleteRoles = asyncHandler(async (request, response) => {
    const {roleId} = request?.params;

    if(!roleId){
        throw new apiError(400, "Role id required")
    }

    if(!isObjectIdValid(roleId)){
        throw new apiError(400, "Role ID is invalid")
    }

    const foundRole = await Role.findById(roleId).select("+usageCount");

    if(!foundRole){
        throw new apiError(404, "Role not found or maybe deleted")
    }

    if(foundRole.usageCount > 0){
        throw new apiError(400, "Cannot delete: role is still in use")
    }

    await Role.findByIdAndDelete(roleId);

    foundRole.usageCount = foundRole.usageCount - 1;
    foundRole.save({validateBeforeSave: false});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Role deleted successfully")
    )

});

export {deleteRoles}