import { apiResponse, asyncHandler, User } from "../../allImports.js";

const getUsers = asyncHandler(async(request, response) => {
    const users = await User.find({
        company: request.user.company
    }).select("fullname _id");

    return response.status(200)
    .json(
        new apiResponse(200, users, "Users fetched successfully")
    )

});

export {getUsers}