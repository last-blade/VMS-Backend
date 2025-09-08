import { OTP } from "../models/otp.model.js";
import { apiError } from "./apiError.js";


const verifyOtpHelper = async (incomingEmail, incomingOTP) => {

    const foundUser = await OTP.findOne({email: incomingEmail});

    incomingOTP = parseInt(incomingOTP);

    if(!foundUser){
        throw new apiError(400, "OTP expired, send OTP again.")
    }

    const databaseOTP = foundUser.otp[0];

    if(incomingOTP !== databaseOTP){
        throw new apiError(400, "Incorrect OTP.")
    }

    await OTP.findOneAndDelete({ email: incomingEmail });

    return true;
}

export {verifyOtpHelper}