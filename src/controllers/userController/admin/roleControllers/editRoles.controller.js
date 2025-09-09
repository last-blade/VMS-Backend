import mongoose from "mongoose";
import { apiError, apiResponse, asyncHandler, isObjectIdValid, Role } from "../../../allImports.js";

const editRoles = asyncHandler(async (request, response) => {
    const {roleId} = request?.params;
    const {roleName} = request.body;

    if(!roleId){
        throw new apiError(400, "Role id required")
    }

    if(!isObjectIdValid(roleId)){
        throw new apiError(400, "Role ID is invalid")
    }

    if(roleName.trim() === "" || roleName === undefined){
        throw new apiError(400, "Role name required")
    }

    const foundRole = await Role.findById(roleId);

    if(!foundRole){
        throw new apiError(404, "Role not found or maybe deleted")
    }

    await Role.findByIdAndUpdate(roleId, {
        $set: {
            roleName
        }
    }, {new: true});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Role name updated successfully")
    )

});

export {editRoles}