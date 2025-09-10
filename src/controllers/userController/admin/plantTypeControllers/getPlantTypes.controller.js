import { apiResponse, asyncHandler, PlantType } from "../../../allImports.js";

const getPlantTypes = asyncHandler(async (request, response) => {
    const plantTypes = await PlantType.find({
        company: request.user?.company,
    }).populate("plantTypeCreator", "fullname")
    .populate("company", "companyName")

    return response.status(200)
    .json(
        new apiResponse(200, plantTypes, "Plant types fetched successfully")
    )
});

export {getPlantTypes}