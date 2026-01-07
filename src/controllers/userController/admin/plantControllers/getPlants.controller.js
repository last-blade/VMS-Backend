import { apiResponse, asyncHandler, Plant } from "../../../allImports.js";

const getPlants = asyncHandler(async (request, response) => {
    const { companyId } = request.query;

    const filterCompanyId = companyId || request.user?.company;

    if (!filterCompanyId) {
        return response.status(400).json(
            new apiResponse(400, null, "Company ID is required")
        );
    }

    const plants = await Plant.find({
        company: filterCompanyId,
    })
    .populate("company", "companyName")
    .populate("plantType", "plantType")
    .populate("plantCountry", "countryName")
    .populate("plantState", "stateName")
    .populate("plantCity", "cityName")
    .populate("plantCreator", "fullname");

    return response.status(200).json(
        new apiResponse(200, plants, "Plants fetched successfully")
    );
});


export {getPlants}