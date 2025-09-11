import { apiError, apiResponse, asyncHandler, Role } from "../../../allImports.js";

const createRoles = asyncHandler(async (request, response) => {
    const {roleName} = request.body;

    if(!roleName|| roleName.trim() === ""){
        throw new apiError(400, "Role name required")
    }

    const foundRole = await Role.findOne({
        roleName,
        roleCreator: request.user.id,
        company: request.user.company,
    });

    if(foundRole){
        throw new apiError(400, "Role name already exists")
    }

    await Role.create({
        roleName,
        roleCreator: request.user.id,
        company: request.user.company,
    });

    return response.status(201)
    .json(
        new apiResponse(201, {}, "User role created successfully")
    )

});

export {createRoles}