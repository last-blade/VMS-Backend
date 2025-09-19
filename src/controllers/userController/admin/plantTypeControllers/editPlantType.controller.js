import { apiError, apiResponse, asyncHandler, isObjectIdValid, PlantType } from "../../../allImports.js";

const editPlantType = asyncHandler(async (request, response) => {
    const {plantType} = request.body;
    const {plantTypeId} = request.params;

    if(!isObjectIdValid(plantTypeId)){
        throw new apiError(400, "PlantType ID is not valid")
    }

    const foundPlantType = await PlantType.findById(plantTypeId);

    if(!foundPlantType){
        throw new apiError(404, "PlantType not found, maybe deleted")
    }

    if(!plantType || plantType.trim() === ""){
        throw new apiError(400, "Plant type is required")
    }

    const isPlantTypeExist = await PlantType.findOne({
        plantType,
        company: request.user.company,
    });

    if(isPlantTypeExist){
        throw new apiError(400, "Plant type already exists in your company")
    }

    await PlantType.findByIdAndUpdate(plantTypeId, {
        plantType,
    });

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Plant type updated successfully")
    )

});

export {editPlantType}