import { apiError, apiResponse, asyncHandler, Company, Country, isObjectIdValid, State } from "../../../allImports.js";

const editState = asyncHandler(async (request, response) => {
    const {stateName, country} = request.body;
    const {stateId} = request.params;

    if(!isObjectIdValid(stateId)){
        throw new apiError(400, "State ID is not valid")
    }

    const foundState = await State.findById(stateId);

    if(!foundState){
        throw new apiError(404, "State not found, maybe deleted")
    }

    if(!stateName || stateName.trim() === ""){
        throw new apiError(400, "Country name is required")
    }

    if(!isObjectIdValid(country)){
        throw new apiError(400, "Country ID is invalid")
    }

    const isStateExist = await State.findOne({
        stateName,
        company: request.user.company,
    });

    if(isStateExist){
        throw new apiError(400, "State name already exists in your company")
    }

    await State.findByIdAndUpdate(stateId, {
        $set: {
            stateName,
            country,
        }
    });

    if(foundState.country.toString() !== country.toString()){
        await Country.findByIdAndUpdate(country, {
            $inc: {
                usageCount: -1
            }
        }, {new: true})
    }

    return response.status(200)
    .json(
        new apiResponse(200, {}, "State updated successfully")
    );

});

export {editState}