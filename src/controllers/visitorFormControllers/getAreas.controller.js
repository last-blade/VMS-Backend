import { apiResponse, Area, asyncHandler } from "../../controllers/allImports.js";

const getAreasForVForm = asyncHandler(async (request, response) => {

    const { plantId } = request.query;

    if (!plantId) {
        return response.status(400).json(
            new apiResponse(400, null, "Company ID is required")
        );
    }

    const areas = await Area.find({
        plant: plantId,
    }).populate("plant", "plantName").populate("company", "companyName").populate("areaCreator", "fullname")

    return response.status(200)
    .json(
        new apiResponse(200, areas, "Areas fetched successfully")
    )
});

export {getAreasForVForm}