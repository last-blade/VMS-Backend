import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./cron/expireAppointments.js";

dotenv.config({
    path: "./.env"
})

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}

app.use(cors(corsOptions));
app.use(express.json({limit: "2mb"}));
app.use(urlencoded({extended: true, limit: "2mb"}));
app.use(cookieParser());
app.use(express.static("public"));


//Importing Routes
import webhookRoutes from "./routes/webhook.js";
import userRoutes from "./routes/user.routes.js"
import vistorformRoutes from "./routes/visitorform.routes.js"


//Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/visitor-form", vistorformRoutes);

//Webhook
app.use("/webhook", webhookRoutes);

export {app}