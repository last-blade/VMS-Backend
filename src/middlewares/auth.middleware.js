import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const authentication = asyncHandler(async (request, _, next) => {
    const {accessToken} = request?.cookies;

    if(!accessToken){
        throw new apiError(404, "Access token not found")
    }

    const decodedToken = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY)

    if(!decodedToken){
        throw new apiError(401, "Provided toaken expired, unauthorized access!")
    }

    const userId = decodedToken.id;

    const foundUser = await User.findById(userId);

    if(!foundUser){
        throw new apiError(404, "Invalid token or expired")
    }

    request.user = foundUser;
    
    next();

});

export {authentication}