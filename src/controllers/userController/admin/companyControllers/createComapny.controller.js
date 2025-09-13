import { apiError, apiResponse, asyncHandler, City, Company, Country, isObjectIdValid, State } from "../../../allImports.js";

const createComapny = asyncHandler(async (request, response) => {
    const {companyName, companyCountry, companyState, companyCity} = request.body;

    const existingCompany = await Company.findById(request.user?.company);
    if(existingCompany){
        throw new apiError(404, "Already own a company, can't add another.")
    }

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

    await City.findByIdAndUpdate(companyCity, { $inc: { usageCount: 1 } });
    await State.findByIdAndUpdate(companyState, { $inc: { usageCount: 1 } });
    await Country.findByIdAndUpdate(companyCountry, { $inc: { usageCount: 1 } });

    return response.status(201)
    .json(
        new apiResponse(201, {}, "Company created successfully")
    )

});

export {createComapny}