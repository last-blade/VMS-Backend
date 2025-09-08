import { Employee } from "../models/employee.model.js";
import { User } from "../models/user.model.js"

const generateRefreshToken = async (userId, accountType) => {

    if(accountType === "Supervisor" || accountType === "Mechanic" || accountType === "Production"){
        const foundUser = await Employee.findById(userId);
        const refreshToken = foundUser.generateRefreshToken();
        return refreshToken;
    }
    const foundUser = await User.findById(userId);

    const refreshToken = await foundUser.generateRefreshToken();
    
    return refreshToken;
}

export { generateRefreshToken }