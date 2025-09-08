import mongoose, { Schema } from "mongoose";

const plantSchema = new Schema({

    plantName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
    },

    plantCompany: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,        
    },

    plantType: {
        type: Schema.Types.ObjectId,
        ref: "PlantType",
        required: true,
    },

    plantCountry: {
        type: Schema.Types.ObjectId,
        ref: "Country",
        required: true,
    },

    plantState: {
        type: Schema.Types.ObjectId,
        ref: "State",
        required: true,
    },

    plantCity: {
        type: Schema.Types.ObjectId,
        ref: "City",
        required: true,
    },

    plantCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    isPlantActive: {
        type: Boolean,
        default: true,
    },

}, {timestamps: true});

export const Plant = mongoose.model("Plant", plantSchema);