import { apiError, apiResponse, asyncHandler, isObjectIdValid, State } from "../../../allImports.js";

const deleteState = asyncHandler(async (request, response) => {
    const {stateId} = request.params;

    if(!isObjectIdValid(stateId)){
        throw new apiError(400, "State ID is not valid")
    }

    const foundState = await State.findById(stateId);

    if(!foundState){
        throw new apiError(404, "State not found, maybe deleted")
    }

    if(foundState.usageCount > 0){
        throw new apiError(400, "Cannot delete: state is still in use")
    }

    await State.findByIdAndDelete(stateId);

    foundState.usageCount = usageCount - 1;
    foundState.save({validateBeforeSave: false});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "State deleted successfully")
    )
});

export {deleteState}