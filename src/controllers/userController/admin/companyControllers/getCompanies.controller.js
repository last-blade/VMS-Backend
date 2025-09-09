import { apiError, apiResponse, asyncHandler, Company, isObjectIdValid } from "../../../allImports.js";

const getCompanies = asyncHandler(async (request, response) => {
   const companyId = request.user?.company;
   
   if(!isObjectIdValid(companyId)){
    throw new apiError(400, "Company ID is invalid")
   }

   const company = await Company.findById(companyId).populate("companyState companyCity companyCountry");

   return response.status(200)
   .json(
        new apiResponse(200, company, "Companies fetched successfully")
   )

});

export {getCompanies}