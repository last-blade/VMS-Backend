import { apiError, apiResponse, asyncHandler, Country, isObjectIdValid } from "../../../allImports.js";

const deleteCountry = asyncHandler(async (request, response) => {
    const {countryId} = request.params;

    if(!isObjectIdValid(countryId)){
        throw new apiError(400, "Country ID is not valid")
    }

    const foundCountry = await Country.findById(countryId);

    if(!foundCountry){
        throw new apiError(404, "Country not found, maybe deleted")
    }

    if(foundCountry.usageCount > 0){
        throw new apiError(400, "Cannot delete: country is still in use")
    }

    await Country.findByIdAndDelete(countryId);

    foundCountry.usageCount = usageCount - 1;
    foundCountry.save({validateBeforeSave: false});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Country deleted successfully")
    )
});

export {deleteCountry}