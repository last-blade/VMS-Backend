import { apiError, apiResponse, asyncHandler, PlantType, isObjectIdValid } from "../../../allImports.js";

const deletePlantType = asyncHandler(async (request, response) => {
    const {plantTypeId} = request.params;

    if(!isObjectIdValid(plantTypeId)){
        throw new apiError(400, "PlantType ID is not valid")
    }

    const foundPlantType = await PlantType.findById(plantTypeId).select("+usageCount");

    if(!foundPlantType){
        throw new apiError(404, "PlantType not found, maybe deleted")
    }

    if(foundPlantType.usageCount > 0){
        throw new apiError(400, "Cannot delete: plant-type is still in use")
    }

    await PlantType.findByIdAndDelete(plantTypeId);

    // foundPlantType.usageCount = foundPlantType.usageCount - 1;
    // foundPlantType.save({validateBeforeSave: false});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "PlantType deleted successfully")
    )
});

export {deletePlantType}