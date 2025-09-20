import { apiError, apiResponse, Area, asyncHandler, isObjectIdValid } from "../../../allImports.js";

const deleteArea = asyncHandler(async (request, response) => {
    const {areaId} = request.params;

    if(!isObjectIdValid(areaId)){
        throw new apiError(400, "Area ID is not valid")
    }

    const foundArea = await Area.findById(areaId).select("usageCount");

    if(!foundArea){
        throw new apiError(404, "Area not found, maybe deleted")
    }

    if(foundArea.usageCount > 0){
        throw new apiError(400, "Cannot delete: area is still in use")
    }

    await Area.findByIdAndDelete(areaId);

    // foundArea.usageCount = foundArea.usageCount - 1;
    // foundArea.save({validateBeforeSave: false});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Area deleted successfully")
    )
});

export {deleteArea}