import { User } from "../models/user.model.js"

const generateAccessToken = async (userId, accountType) => {
    try {
        const foundUser = await User.findById(userId);
        const accessToken = foundUser.generateAccessToken();
        return accessToken;
    } catch (error) {
        console.log(`Error while generating access token ${error.message}`);
    }
}

export { generateAccessToken }