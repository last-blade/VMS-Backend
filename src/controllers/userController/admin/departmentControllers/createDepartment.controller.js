import { apiError, apiResponse, asyncHandler, Company, Department, isObjectIdValid } from "../../../allImports.js";

const createDeparment = asyncHandler(async (request, response) => {
    const {departmentName, headOfDepartment} = request.body;

    if(departmentName === undefined || departmentName.trim() === ""){
        throw new apiError(400, "Department name is required")
    }

    if(headOfDepartment){
        if(!isObjectIdValid(headOfDepartment)){
            throw new apiError(400, "HOD ID is invalid")
        }
    }

    await Department.create({
        departmentName,
        departmentCreator: request.user.id,
        headOfDepartment,
        company: request.user.company,
    });

    await Company.findByIdAndUpdate(request.user.company, {
        $inc: {
            usageCount: 1
        }
    }, {new: true});

    return response.status(201)
    .json(
        new apiResponse(201, {}, "Department created successfully")
    )

});

export {createDeparment}