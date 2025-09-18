import { apiError, apiResponse, asyncHandler, Country, isObjectIdValid } from "../../../allImports.js";

const editCountry = asyncHandler(async (request, response) => {
    const {countryName} = request.body;
    const {countryId} = request.params;

    if(!isObjectIdValid(countryId)){
        throw new apiError(400, "Invalid country id")
    }

    if(countryName === undefined || countryName.trim() === ""){
        throw new apiError(400, "Country name is required")
    }

    const foundCountry = await Country.findOne({
        countryName,
        company: request.user.company,
    });

    if(foundCountry){
        throw new apiError(400, "Country name already exists in your company")
    }

    await Country.findByIdAndUpdate(countryId, {
        $set: {
            countryName
        }
    }, {new: true});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Country updated successfully")
    )
});

export {editCountry}