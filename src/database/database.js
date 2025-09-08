import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInsatnce = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MongoDB Connected!!", connectionInsatnce.connection.host);
    } catch (error) {
        console.log("Error while connecting to database: ", error.message)
    }
};

export {connectDB}