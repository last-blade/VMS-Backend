import { apiError, apiResponse, asyncHandler, Company, isObjectIdValid } from "../../../allImports.js";

const createComapny = asyncHandler(async (request, response) => {
    const {companyName, companyCountry, companyState, companyCity} = request.body;

    if(!companyName || companyName.trim() === ""){
        throw new apiError(400, "Company name is required")
    }

    if(!isObjectIdValid(companyCountry) || !isObjectIdValid(companyCity) || !isObjectIdValid(companyState)){
        throw new apiError(400, "Please provide valid object ids of country, city & state")
    }

    const foundCompanyName = await Company.findOne({companyName});

    if(foundCompanyName){
        throw new apiError(400, "Company name already exists, please try different company name")
    }

    await Company.create({
        companyName,
        companyCountry,
        companyState,
        companyCity,
        companyCreator: request.user.id,
    });

    return response.status(201)
    .json(
        new apiResponse(201, {}, "Company created successfully")
    )

});

export {createComapny}