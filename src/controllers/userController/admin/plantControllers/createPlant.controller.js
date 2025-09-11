import { apiError, apiResponse, asyncHandler, isObjectIdValid, Plant } from "../../../allImports.js";

const createPlant = asyncHandler(async (request, response) => {
    const {plantName, plantType, plantCountry, plantState, plantCity} = request.body;

    if(!plantName || plantName.trim() === ""){
        throw new apiError(400, "Plant is required")
    }

    if(!isObjectIdValid(plantType) || !isObjectIdValid(plantCountry) || !isObjectIdValid(plantState) || !isObjectIdValid(plantCity)){
        throw new apiError(400, "Object IDs are invalid")
    }

    const foundPlant = await Plant.findOne({
        plantName,
        plantCreator: request.user.id,
        company: request.user.company,
    });

    if(foundPlant){
        throw new apiError(400, "Plant already exists")
    }

    await Plant.create({
        plantName,
        plantCreator: request.user.id,
        company: request.user.company,
        plantType: plantType,
        plantCountry: plantCountry,
        plantState: plantState,
        plantCity: plantCity,
    });

    return response.status(201)
    .json(
        new apiResponse(201, {}, "Plant created successfully")
    )

});

export {createPlant}