import { apiError, apiResponse, asyncHandler, Company, isObjectIdValid } from "../../../allImports.js";

const createComapny = asyncHandler(async (request, response) => {
    const {companyName, companyCountry, companyCity} = request.body;

    if(companyName.trim() === "" || companyName === undefined){
        throw new apiError(400, "Company name required")
    }

    if(!isObjectIdValid(companyCountry) || !isObjectIdValid(companyCity)){
        throw new apiError(400, "Please provide valid object ids of country and city")
    }

    const foundCompanyName = await Company.findOne({companyName});

    if(foundCompanyName){
        throw new apiError(400, "Company name already exists, please try different company name")
    }

    await Company.create({
        companyName,
        companyCountry,
        companyCity,
        companyCreator: request.user.id,
    });

    return response.status(201)
    .json(
        new apiResponse(201, {}, "Company created successfully")
    )

});

export {createComapny}