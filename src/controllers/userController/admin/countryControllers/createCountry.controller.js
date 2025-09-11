import { apiError, apiResponse, asyncHandler, Country } from "../../../allImports.js";

const createCountry = asyncHandler(async (request, response) => {
    const {countryName} = request.body;

    if(countryName === undefined || countryName.trim() === ""){
        throw new apiError(400, "Country name is required")
    }

    const foundCountry = await Country.findOne({
        countryName,
        countryCreator: request.user.id,
        company: request.user.company,
    });

    if(foundCountry){
        throw new apiError(400, "Country name already exists")
    }

    await Country.create({
        countryName,
        countryCreator: request.user.id,
        company: request.user.company,
    });

    return response.status(201)
    .json(
        new apiResponse(201, {}, "Country created successfully")
    )

});

export {createCountry}