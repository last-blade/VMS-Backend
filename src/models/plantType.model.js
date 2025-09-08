import mongoose, { Schema } from "mongoose";

const plantTypeSchema = new Schema({
    plantType: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },

    plantTypeCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

}, {timestamps: true});

export const PlantType = mongoose.model("PlantType", plantTypeSchema);