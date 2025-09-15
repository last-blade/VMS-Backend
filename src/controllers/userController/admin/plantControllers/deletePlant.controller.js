import { apiError, apiResponse, asyncHandler, isObjectIdValid, Plant } from "../../../allImports.js";

const deletePlant = asyncHandler(async (request, response) => {
    const {plantId} = request.params;

    if(!isObjectIdValid(plantId)){
        throw new apiError(400, "Plant ID is not valid")
    }

    const foundPlant = await Plant.findById(plantId);

    if(!foundPlant){
        throw new apiError(404, "Plant not found, maybe deleted")
    }

    if(foundPlant.usageCount > 0){
        throw new apiError(400, "Cannot delete: plant is still in use")
    }

    await Plant.findByIdAndDelete(plantId);

    foundPlant.usageCount = usageCount - 1;
    foundPlant.save({validateBeforeSave: false});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Plant deleted successfully")
    )
});

export {deletePlant}