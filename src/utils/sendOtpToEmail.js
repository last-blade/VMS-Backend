import { sendMail } from "./sendEmail.js";
import { OTP } from "../models/otp.model.js";

const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

const sendOtpToEmail = async (email, subject) => {
    const existingOTP = await OTP.findOne({ email });

    if (existingOTP) {
        throw new Error("Please wait before requesting a new OTP.");
    }

    const generatedOTP = generateOTP();

    const emailBody = `
        <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f9f9f9;">
        <div style="background-color: #0047AB; color: #fff; padding: 20px 30px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; font-weight: 600;"> Jasmine Automate</h2>
            <p style="margin: 5px 0 0;">Secure Verification Code</p>
        </div>

        <div style="padding: 30px;">
            <p style="font-size: 16px;">Dear User,</p>
            <p style="font-size: 15px;">You have requested a One-Time Password (OTP) to verify your identity. Please use the code below:</p>

            <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #0047AB; color: #fff; font-size: 24px; font-weight: bold; padding: 12px 24px; border-radius: 6px; letter-spacing: 2px;">
                ${generatedOTP}
            </span>
            </div>

            <p style="font-size: 14px;">For your security, do not share this code with anyone. This OTP is valid for a limited time only.</p>
            <p style="font-size: 14px;">If you did not request this code, please ignore this email or contact support immediately.</p>

            <p style="margin-top: 40px; font-size: 14px;">Warm regards,</p>
            <p style="font-weight: 600; font-size: 15px;">Jasmine Automate<br/>Enterprise Security Team</p>
        </div>

        <div style="background-color: #f1f1f1; color: #777; text-align: center; padding: 15px; border-top: 1px solid #ddd; border-radius: 0 0 8px 8px; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Jasmine Automate. All rights reserved.</p>
        </div>
        </div>
    `;

    await sendMail(email, subject, emailBody);

    await OTP.findOneAndUpdate(
        { email },
        { $push: { otp: generatedOTP }, createdAt: new Date() },
        { new: true, upsert: true }  
    );

    return generatedOTP;
};

export { sendOtpToEmail };
