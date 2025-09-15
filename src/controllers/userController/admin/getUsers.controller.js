import { apiResponse, asyncHandler, User } from "../../allImports.js";

const getUsers = asyncHandler(async(request, response) => {
    const users = await User.find(request.user.company);

    return response.status(200)
    .json(
        new apiResponse(200, users, "Users fetched successfully")
    )

});

export {getUsers}