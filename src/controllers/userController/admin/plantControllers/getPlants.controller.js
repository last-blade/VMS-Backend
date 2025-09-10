import { apiResponse, asyncHandler, Plant } from "../../../allImports.js";

const getPlants = asyncHandler(async (request, response) => {
    const plants = await Plant.find({
        company: request.user?.company,
    }).populate("company", "companyName")
    .populate("plantType", "plantType")
    .populate("plantCountry", "countryName")
    .populate("plantState", "stateName")
    .populate("plantCity", "cityName")
    .populate("plantCreator", "fullname")

    return response.status(200)
    .json(
        new apiResponse(200, plants, "Plants fetched successfully")
    )
});

export {getPlants}