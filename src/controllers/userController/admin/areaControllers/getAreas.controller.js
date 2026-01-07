import { apiResponse, Area, asyncHandler } from "../../../allImports.js";

const getAreas = asyncHandler(async (request, response) => {

    const { companyId } = request.query;

    const filterCompanyId = companyId || request.user?.company;

    if (!filterCompanyId) {
        return response.status(400).json(
            new apiResponse(400, null, "Company ID is required")
        );
    }

    const areas = await Area.find({
        company: filterCompanyId,
    }).populate("plant", "plantName").populate("company", "companyName").populate("areaCreator", "fullname")

    return response.status(200)
    .json(
        new apiResponse(200, areas, "Areas fetched successfully")
    )
});

export {getAreas}