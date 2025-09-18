import { apiError, apiResponse, asyncHandler, City, isObjectIdValid } from "../../../allImports.js";

const editCity = asyncHandler(async (request, response) => {
    const {cityId} = request.params;
    const {cityName, country, state} = request.body;

    if(!isObjectIdValid(cityId)){
        throw new apiError(404, "Invalid city id")
    }

    if(cityName === undefined || cityName.trim() === ""){
        throw new apiError(400, "City name is required")
    }

    if(!isObjectIdValid(country) || !isObjectIdValid(state)){
        throw new apiError(400, "Country or State ID is invalid")
    }

    const foundCity = await City.findOne({
        cityName,
        company: request.user.company,
    });

    if(foundCity){
        throw new apiError(400, "City name already exists in your company")
    }

    await City.findByIdAndUpdate(cityId, {
        $set: {
            cityName, 
            country, 
            state,
        }
    }, {new: true});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "City updated successfully")
    )

});

export {editCity}