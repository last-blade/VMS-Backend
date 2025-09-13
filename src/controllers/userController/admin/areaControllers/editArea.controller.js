import { apiError, apiResponse, Area, asyncHandler, isObjectIdValid } from "../../../allImports.js";

const editArea = asyncHandler(async (request, response) => {
    const {areaId} = request.params;

    const { areaName, plant } = request.body;

    if(!areaName || areaName.trim() === ""){
        throw new apiError(400, "Area name is required")
    }

    if(!isObjectIdValid(plant)){
        throw new apiError(400, "Plant ID is invalid")
    }

    if(!isObjectIdValid(areaId)){
        throw new apiError(400, "Area ID is invalid")
    }

    const foundArea = await Area.findById(areaId);

    if(!foundArea){
        throw new apiError(404, "Area not found, maybe deleted")
    }

    await Area.findByIdAndUpdate(areaId, {
        $set: {
            areaName, 
            plant
        }
    }, {new: true});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Area updated successfully")
    )

});

export {editArea}