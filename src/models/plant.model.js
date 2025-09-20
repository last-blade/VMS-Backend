import mongoose, { Schema } from "mongoose";

const plantSchema = new Schema({

    plantName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
    },

    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,  
        index: true,      
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

    plantQr: {
        type: String,
        required: false,
        trim: true,
    },

    usageCount: {
        type: Number,
        required: true,
        select: false,
        default: 0,
    },

}, {timestamps: true});

plantSchema.index({plantName: 1, company: 1}, {unique: 1});

export const Plant = mongoose.model("Plant", plantSchema);