import { apiError, apiResponse, asyncHandler, Company, isObjectIdValid } from "../../../allImports.js";

const deleteCompany = asyncHandler(async (request, response) => {
    const {companyId} = request.params;

    if(!isObjectIdValid(companyId)){
        throw new apiError(400, "Company ID is not valid")
    }

    const foundCompany = await Company.findById(companyId).select("+usageCount");

    if(!foundCompany){
        throw new apiError(404, "Company not found, maybe deleted")
    }

    if(foundCompany.usageCount > 0){
        throw new apiError(400, "Cannot delete: company is still in use")
    }

    await Company.findByIdAndDelete(companyId);

    foundCompany.usageCount = foundCompany.usageCount - 1;
    foundCompany.save({validateBeforeSave: false});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Company deleted successfully")
    )

});

export {deleteCompany}