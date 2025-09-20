import { apiError, apiResponse, City, asyncHandler, isObjectIdValid } from "../../../allImports.js";

const deleteCity = asyncHandler(async (request, response) => {
    const {cityId} = request.params;

    if(!isObjectIdValid(cityId)){
        throw new apiError(400, "City ID is not valid")
    }

    const foundCity = await City.findById(cityId).select("+usageCount");

    if(!foundCity){
        throw new apiError(404, "City not found, maybe deleted")
    }

    if(foundCity.usageCount > 0){
        throw new apiError(400, "Cannot delete: city is still in use")
    }

    await City.findByIdAndDelete(cityId);

    foundCity.usageCount = foundCity.usageCount - 1;
    foundCity.save({validateBeforeSave: false});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "City deleted successfully")
    )
});

export {deleteCity}