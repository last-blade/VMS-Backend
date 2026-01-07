import { apiResponse, asyncHandler, Plant } from "../../controllers/allImports.js";

const getPlantsForVForm = asyncHandler(async (request, response) => {
    const { companyId } = request.query;

    if (!companyId) {
        return response.status(400).json(
            new apiResponse(400, null, "Company ID is required")
        );
    }

    const plants = await Plant.find({
        company: companyId,
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


export {getPlantsForVForm}