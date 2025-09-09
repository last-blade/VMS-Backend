import { apiError, apiResponse, asyncHandler, Role } from "../../../allImports.js";

const deleteRoles = asyncHandler(async (request, response) => {
    const {roleId} = request?.params;

    if(!roleId){
        throw new apiError(400, "Role id required")
    }

    if(!isObjectIdValid(roleId)){
        throw new apiError(400, "Role ID is invalid")
    }

    const foundRole = await Role.findById(roleId);

    if(!foundRole){
        throw new apiError(404, "Role not found or maybe deleted")
    }

    await Role.findByIdAndDelete(roleId);

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Role deleted successfully")
    )

});

export {deleteRoles}