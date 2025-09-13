import mongoose, { Schema } from "mongoose";

const plantTypeSchema = new Schema({
    plantType: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },

    plantTypeCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
    },
    
    usageCount: {
        type: Number,
        required: true,
        select: false,
        trim: true,
        default: 0,
    },

}, {timestamps: true});

plantTypeSchema.index({plantType: 1, company: 1}, {unique: true});

export const PlantType = mongoose.model("PlantType", plantTypeSchema);