import { apiError, apiResponse, asyncHandler, PlantType } from "../../../allImports.js";

const createPlantType = asyncHandler(async (request, response) => {
    const {plantType} = request.body;

    if(plantType.trim() === "" || plantType === undefined){
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

    return response.status(201)
    .json(
        new apiResponse(201, {}, "Plant type created successfully")
    )

});

export {createPlantType}