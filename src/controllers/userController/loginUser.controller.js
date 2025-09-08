import { generateAccessToken } from "../../utils/generateAccessToken.js";
import { generateRefreshToken } from "../../utils/generateRefreshToken.js";
import { apiError, apiResponse, asyncHandler, User } from "../allImports.js";

const loginUser = asyncHandler(async (request, response) => {
    const {email, password} = request.body;

    if(!email.trim() || !password){
        throw new apiError(404, "All fields are required")
    }

    const foundUser = await User.findOne({email});

    if(!foundUser){
        throw new apiError(404, "User with this email does not exists")
    }

    const isValidPassword = await foundUser.isPasswordCorrect(password);

    if(!isValidPassword){
        throw new apiError(401, "Incorrect password")
    }

    const accessToken = await generateAccessToken(foundUser._id);
    const refreshToken = await generateRefreshToken(foundUser._id);

    if(!accessToken || !refreshToken){
        throw new apiError(500, "Error in generating access and refresh token")
    }

    foundUser.refreshToken = refreshToken;
    foundUser.save({validateBeforeSave: false});

    const user = await User.findOne({email}).select("-password -refreshToken -_id -__v");

    return response.status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(
        new apiResponse(200, user, "Logged in successfully")
    )

});

export {loginUser}