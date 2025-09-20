import { apiError, apiResponse, asyncHandler, Company, PlantType } from "../../../allImports.js";

const createPlantType = asyncHandler(async (request, response) => {
    const {plantType} = request.body;

    if(!plantType || plantType.trim() === ""){
        throw new apiError(400, "Plant type is required")
    }

    const foundPlantType = await PlantType.findOne({
        plantType,
        plantTypeCreator: request.user.id,
        company: request.user.company,
    });

    if(foundPlantType){
        throw new apiError(400, "Plant type already exists")
    }

    await PlantType.create({
        plantType,
        plantTypeCreator: request.user.id,
        company: request.user.company,
    });

    await Company.findByIdAndUpdate(request.user.company, { $inc: { usageCount: 1 } });

    return response.status(201)
    .json(
        new apiResponse(201, {}, "Plant type created successfully")
    )

});

export {createPlantType}