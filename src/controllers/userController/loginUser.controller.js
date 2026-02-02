import { accessTokenOptions, refreshTokenOptions } from "../../constants.js";
import { generateAccessToken } from "../../utils/generateAccessToken.js";
import { generateRefreshToken } from "../../utils/generateRefreshToken.js";
import { apiError, apiResponse, asyncHandler, User } from "../allImports.js";

const loginUser = asyncHandler(async (request, response) => {
  const { email, mobile, password } = request.body;

  if ((!email || email.trim() === "") && !mobile) {
    throw new apiError(400, "Email or mobile number is required for login");
  }

  if (!password) {
    throw new apiError(400, "Password is required");
  }

  const query = {};
  if (email && email.trim() !== "") query.email = email;
  if (mobile) query.mobile = Number(mobile);

  const foundUser = await User.findOne(query)
    .select("+password")
    .populate("department", "departmentName")
    .populate("company", "companyName")
    .populate("plant", "plantName")
    .populate("role", "roleName");

  if (!foundUser) {
    throw new apiError(404, "User not found");
  }

  const isValidPassword = await foundUser.isPasswordCorrect(password);
  if (!isValidPassword) {
    throw new apiError(401, "Incorrect password");
  }

  const accessToken = await generateAccessToken(foundUser._id);
  const refreshToken = await generateRefreshToken(foundUser._id);

  foundUser.refreshToken = refreshToken;
  await foundUser.save({ validateBeforeSave: false });

  foundUser.password = undefined;
  foundUser.refreshToken = undefined;
  foundUser.__v = undefined;

  return response
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(new apiResponse(200, foundUser, "Logged in successfully"));
});


export {loginUser}