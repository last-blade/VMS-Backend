import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const defaultTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SENDERS_EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

const supportTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SUPPORT_SENDERS_EMAIL,
        pass: process.env.SUPPORT_EMAIL_APP_PASSWORD,
    },
});


const sendMail = async (to, subject, body, options = { type: "default" }) => {
    try {
        const isSupport = options.type === "support";

        const transporter = isSupport ? supportTransporter : defaultTransporter;
        const from = isSupport
            ? `"${process.env.SUPPORT_SENDERS_NAME}" <${process.env.SUPPORT_SENDERS_EMAIL}>`
            : `"${process.env.SENDERS_NAME}" <${process.env.SENDERS_EMAIL}>`;

        const info = await transporter.sendMail({
            from,
            to,
            subject,
            html: body,
        });

        return;
    } catch (error) {
        console.error("Error sending email:", error);
    }
};


export {sendMail}