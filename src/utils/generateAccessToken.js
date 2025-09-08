import { Employee } from "../models/employee.model.js";
import { User } from "../models/user.model.js"

const generateAccessToken = async (userId, accountType) => {
    try {
        if(accountType === "Supervisor" || accountType === "Mechanic" || accountType === "Production"){
            const foundUser = await Employee.findById(userId);
            const accessToken = foundUser.generateAccessToken();
            return accessToken;
        }
        const foundUser = await User.findById(userId);
        const accessToken = foundUser.generateAccessToken();
        return accessToken;
    } catch (error) {
        console.log(`Error while generating access token ${error.message}`);
    }
}

export { generateAccessToken }