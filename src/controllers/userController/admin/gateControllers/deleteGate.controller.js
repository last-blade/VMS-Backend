import { apiError, apiResponse, asyncHandler, Gate, isObjectIdValid } from "../../../allImports.js";

const deleteGate = asyncHandler(async (request, response) => {
    const {gateId} = request.params;

    if(!isObjectIdValid(gateId)){
        throw new apiError(400, "Gate ID is not valid")
    }

    const foundGate = await Gate.findById(gateId);

    if(!foundGate){
        throw new apiError(404, "Gate not found, maybe deleted")
    }

    if(foundGate.usageCount > 0){
        throw new apiError(400, "Cannot delete: gate is still in use")
    }

    await Gate.findByIdAndDelete(gateId);

    foundGate.usageCount = usageCount - 1;
    foundGate.save({validateBeforeSave: false});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Gate deleted successfully")
    )
});

export {deleteGate}