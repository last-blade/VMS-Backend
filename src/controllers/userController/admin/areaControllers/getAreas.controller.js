import { apiResponse, Area, asyncHandler } from "../../../allImports.js";

const getAreas = asyncHandler(async (request, response) => {
    const areas = await Area.find({
        company: request.user.company,
    }).populate("plant", "plantName").populate("company", "companyName").populate("areaCreator", "fullname")

    return response.status(200)
    .json(
        new apiResponse(200, areas, "Areas fetched successfully")
    )
});

export {getAreas}