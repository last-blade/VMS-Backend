import { apiResponse, asyncHandler, Gate } from "../../../allImports.js";

const getGates = asyncHandler(async (request, response) => {
    const gates = await Gate.find({
        company: request.user?.company,
    }).populate("gateInchargeName", "fullname")
    .populate("plant", "plantName")
    .populate("gateSecurity", "fullname")
    .populate("gateCreator", "fullname")

    return response.status(200)
    .json(
        new apiResponse(200, gates, "Gates fetched successfully")
    )

});

export {getGates}