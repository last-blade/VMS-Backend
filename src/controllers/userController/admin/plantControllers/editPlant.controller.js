import { apiError, apiResponse, asyncHandler, isObjectIdValid, Plant } from "../../../allImports.js";

const editPlant = asyncHandler(async (request, response) => {
    const {plantName, plantType, plantCountry, plantState, plantCity} = request.body;
    const {plantId} = request.params;

    if(!isObjectIdValid(plantId)){
        throw new apiError(400, "Plant ID is not valid")
    }

    const foundPlant = await Plant.findById(plantId);

    if(!foundPlant){
        throw new apiError(404, "Plant not found, maybe deleted")
    }

    if(!plantName || plantName.trim() === ""){
        throw new apiError(400, "Plant name is required")
    }

    if(!isObjectIdValid(plantType) || !isObjectIdValid(plantCountry) || !isObjectIdValid(plantState) || !isObjectIdValid(plantCity)){
        throw new apiError(400, "Object IDs are invalid")
    }

    const isPlantExist = await Plant.findOne({
        plantName,
        company: request.user?.company
    })

    if(isPlantExist){
        throw new apiError(400, "Plant name already exists in you company")
    }

    await Plant.findByIdAndUpdate(plantId, {
        $set: {
            plantName,
            plantType: plantType,
            plantCountry: plantCountry,
            plantState: plantState,
            plantCity: plantCity,
        }
    }, {new: true});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Plant updated successfully")
    )

});

export {editPlant}