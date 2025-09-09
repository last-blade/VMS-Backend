import { apiError, apiResponse, User, asyncHandler } from "../allImports.js";

const registerUser = asyncHandler(async (request, response) => {
    const {fullname, email, password, department, mobile, company, plant, address} = request.body;

    if([fullname, email, password, department, mobile, company, plant].some(inputField => inputField === undefined || inputField.trim() === "")){
        throw new apiError(400, "All fields are required")
    }

    const isUserExists = await User.findOne({email});

    if(isUserExists){
        throw new apiError(400, "User with this email already exists")
    }

    await User.create({
        fullname,
        email,
        password,
        department,
        mobile,
        company,
        plant,
        address,
    });

    return response.status(201)
    .json(
        new apiResponse(201, {}, "User registered successfully")
    )

});

export {registerUser}