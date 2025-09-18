import { apiError, apiResponse, asyncHandler, Company, Role } from "../../../allImports.js";

const createRoles = asyncHandler(async (request, response) => {
    const {roleName} = request.body;

    if(!roleName|| roleName.trim() === ""){
        throw new apiError(400, "Role name required")
    }

    const foundRole = await Role.findOne({
        roleName,
        company: request.user.company,
    });

    if(foundRole){
        throw new apiError(400, "Role name already exists in you company")
    }

    await Role.create({
        roleName,
        roleCreator: request.user.id,
        company: request.user.company,
    });

    await Company.findByIdAndUpdate(request.user.company, { $inc: { usageCount: 1 } });

    return response.status(201)
    .json(
        new apiResponse(201, {}, "User role created successfully")
    )

});

export {createRoles}