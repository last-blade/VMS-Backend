import { apiResponse, Area, asyncHandler } from "../../../allImports.js";

const getAreas = asyncHandler(async (request, response) => {

    const { plantId } = request.query;

    const filterplantId = plantId || request.user?.plant;

    if (!filterplantId) {
        return response.status(400).json(
            new apiResponse(400, null, "Plant ID is required")
        );
    }

    const areas = await Area.find({
        plant: filterplantId,
    }).populate("plant", "plantName").populate("company", "companyName").populate("areaCreator", "fullname")

    return response.status(200)
    .json(
        new apiResponse(200, areas, "Areas fetched successfully")
    )
});

export {getAreas}