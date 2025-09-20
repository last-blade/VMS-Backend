import { apiError, apiResponse, asyncHandler, Gate, isObjectIdValid, Plant } from "../../../allImports.js";

const editGate = asyncHandler(async (request, response) => {
    const {gateName, gateNumber, gateInchargeName, plant, gateOpenTime, gateCloseTime, gateSecurity} = request.body;
    const {gateId} = request.params;

    if(!isObjectIdValid(gateId)){
        throw new apiError(400, "Invalid gate id")
    }

    if(!gateName || gateName.trim() === ""){
        throw new apiError(400, "Gate name required")
    }

    if(gateNumber.trim() === "" || gateNumber === undefined){
        throw new apiError(400, "Gate number required")
    }

    if([gateInchargeName, plant, gateSecurity].some(inputField => !isObjectIdValid(inputField))){
        throw new apiError(400, "Object IDs are not valid")
    }

    const foundGate = await Gate.findOne({
        gateNumber,
        company: request.user.id,
        plant,
    });

    if(foundGate){
        throw new apiError(400, "This gate number already exists in your company")
    }

    await Gate.findByIdAndUpdate(gateId, {
        gateName,
        gateNumber,
        gateInchargeName,
        plant,
        gateOpenTime,
        gateCloseTime,
        gateSecurity,
    }, {new: true});

    if(foundGate.plant.toString() !== plant.toString()){
        await Plant.findByIdAndUpdate(plant, {
            $inc: {
                usageCount: -1
            }
        }, {new: true})
    }

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Gate updated successfully")
    )
});

export {editGate}