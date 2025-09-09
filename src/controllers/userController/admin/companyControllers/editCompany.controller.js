import { apiError, apiResponse, asyncHandler, Company, isObjectIdValid } from "../../../allImports.js";

const editCompany = asyncHandler(async (request, response) => {
    const {companyId} = request?.params;
    const {companyName} = request.body;

    if(!isObjectIdValid(companyId)){
        throw new apiError(400, "Company ID is not valid")
    }

    const foundCompany = await Company.findById(companyId);

    if(!foundCompany){
        throw new apiError(404, "Company not found")
    }

    await Company.findByIdAndUpdate(companyId, {
        $set: {
            companyName
        }
    }, {new: true});

    return response.status(200)
    .json(
        new apiResponse(200, {}, "Company name updated successfully")
    )

});

export {editCompany}