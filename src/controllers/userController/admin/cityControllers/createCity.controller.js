import { apiError, apiResponse, asyncHandler, City, isObjectIdValid, State } from "../../../allImports.js";

const createCity = asyncHandler(async (request, response) => {
    const {cityName, country, state} = request.body;

    if(cityName === undefined || cityName.trim() === ""){
        throw new apiError(400, "City name is required")
    }

    if(!isObjectIdValid(country) || !isObjectIdValid(state)){
        throw new apiError(400, "Country or State ID is invalid")
    }

    const foundCity = await City.findOne({
        cityName,
        cityCreator: request.user.id,
        company: request.user.company,
    });

    if(foundCity){
        throw new apiError(400, "City name already exists")
    }

    await City.create({
        cityName,
        country,
        state,
        cityCreator: request.user.id,
        company: request.user.company,
    });

    return response.status(201)
    .json(
        new apiResponse(201, {}, "City created successfully")
    )

});

export {createCity}