import { apiResponse, asyncHandler, State } from "../../../allImports.js";

const getStates = asyncHandler(async (request, response) => {
    const states = await State.find({
        company: request.user?.company,
    }).populate("country", "countryName")
    .populate("stateCreator", "fullname")
    .populate("company", "companyName")

    return response.status(200)
    .json(
        new apiResponse(200, states, "States fetched successfully")
    )
});

export {getStates}