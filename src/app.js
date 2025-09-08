import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

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

export {app}