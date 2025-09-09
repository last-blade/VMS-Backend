import { apiError, apiResponse, asyncHandler, Company, isObjectIdValid } from "../../../allImports.js";

const changeCompanyActiveStatus = asyncHandler(async (request, response) => {
    const {companyId} = request?.params;

    if(!isObjectIdValid(companyId)){
        throw new apiError(400, "Company ID is not valid")
    }

    const foundCompany = await Company.findById(companyId);

    if(!foundCompany){
        throw new apiError(404, "Company not found")
    }

    await Company.findByIdAndUpdate(companyId, {
        $set: {
            isCompanyActive: false,
        }
    }, {new: true});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Company's active status updated successfully")
    )

});

export {changeCompanyActiveStatus}