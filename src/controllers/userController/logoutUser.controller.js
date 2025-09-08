import { apiResponse, asyncHandler, User } from "../allImports.js";

const logoutUser = asyncHandler(async (request, response) => {

    await User.findByIdAndUpdate(request.user.id, {
        $unset: {
            refreshToken: ""
        }
    }, {new: true});

    return response.status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
        new apiResponse(200, {}, "Logged out successfully")
    )

});

export {logoutUser}