import { apiError, apiResponse, User, asyncHandler } from "../allImports.js";

const registerUser = asyncHandler(async (request, response) => {
    const {fullname, email, password, department, mobile, company, plant, address, role} = request.body;

    if([fullname, password, department, mobile, company, plant, role].some(inputField => inputField === undefined || inputField.trim === "")){
        throw new apiError(400, "All fields are required")
    }

    const isUserExists = await User.findOne({
        $or: [{email}, {mobile}]
    });

    if(isUserExists){
        throw new apiError(400, "User with this mobile or email already exists")
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
        role,
    });

    return response.status(201)
    .json(
        new apiResponse(201, {}, "User registered successfully")
    )

});

export {registerUser}