import { apiError, apiResponse, asyncHandler, Company, Country, isObjectIdValid, State } from "../../../allImports.js";

const createState = asyncHandler(async (request, response) => {
    const {stateName, country} = request.body;

    if(!stateName || stateName.trim() === ""){
        throw new apiError(400, "Country name is required")
    }

    if(!isObjectIdValid(country)){
        throw new apiError(400, "Country ID is invalid")
    }

    const foundState = await State.findOne({
        stateName,
        stateCreator: request.user.id,
        company: request.user.company,
    });

    if(foundState){
        throw new apiError(400, "State name already exists")
    }

    await State.create({
        stateName,
        country,
        stateCreator: request.user.id,
        company: request.user.company,
    });

    await Country.findByIdAndUpdate(country, { $inc: { usageCount: 1 } });
    await Company.findByIdAndUpdate(request.user.company, { $inc: { usageCount: 1 } });

    return response.status(201)
    .json(
        new apiResponse(201, {}, "State created successfully")
    );

});

export {createState}