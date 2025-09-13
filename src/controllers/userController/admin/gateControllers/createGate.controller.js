import { apiError, apiResponse, asyncHandler, Company, Gate, isObjectIdValid, Plant } from "../../../allImports.js";

const createGate = asyncHandler(async (request, response) => {
    const {gateName, gateNumber, gateInchargeName, company, plant, gateOpenTime, gateCloseTime, gateSecurity} = request.body;

    if(!gateName || gateName.trim() === ""){
        throw new apiError(400, "Gate name required")
    }

    if(gateNumber.trim() === "" || gateNumber === undefined){
        throw new apiError(400, "Gate number required")
    }

    if([gateInchargeName, company, plant, gateSecurity].some(inputField => !isObjectIdValid(inputField))){
        throw new apiError(400, "Object IDs are not valid")
    }

    const foundGate = await Gate.findOne({
        gateNumber,
        company: request.user.id,
        plant,
    });

    if(foundGate){
        throw new apiError(400, "This gate number already exists")
    }

    await Gate.create({
        gateName,
        gateNumber,
        gateInchargeName,
        company: request.user.company,
        plant,
        gateOpenTime,
        gateCloseTime,
        gateSecurity,
        gateCreator: request.user.id,
    });

    await Company.findByIdAndUpdate(request.user.company, {
        $inc: {
            usageCount: 1
        }
    }, {new: true});

    await Plant.findByIdAndUpdate(plant, {
        $inc: {
            usageCount: 1
        }
    }, {new: true});

    return response.status(201)
    .json(
        new apiResponse(201, {}, "Gate created successfully")
    )

});

export {createGate}