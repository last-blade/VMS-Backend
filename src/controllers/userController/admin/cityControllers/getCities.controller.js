import { apiResponse, asyncHandler, City } from "../../../allImports.js";

const getCities = asyncHandler(async (request, response) => {
    const cities = await City.find({
        company: request.user.company,
    })
    .populate("cityCreator", "fullname")
    .populate("country", "countryName")
    .populate("state", "stateName")
    .populate("company", "companyName")

    return response.status(200)
    .json(
        new apiResponse(200, cities, "Cities fetched successfully")
    )
});

export {getCities}