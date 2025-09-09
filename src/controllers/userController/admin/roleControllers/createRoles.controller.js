import { apiError, apiResponse, asyncHandler, Role } from "../../../allImports.js";

const createRoles = asyncHandler(async (request, response) => {
    const {roleName} = request.body;

    if(roleName.trim() === "" || roleName === undefined){
        throw new apiError(400, "Role name required")
    }

    await Role.create({
        roleName,
        roleCreator: request.user.id
    });

    return response.status(201)
    .json(
        new apiResponse(201, {}, "User role created successfully")
    )

});

export {createRoles}