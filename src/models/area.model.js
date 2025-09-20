import mongoose, { Schema } from "mongoose";

const areaSchema = new Schema({
    areaName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true
    },

    plant: {
        type: Schema.Types.ObjectId,
        ref: "Plant",
        required: true,
    },

    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
    },

    areaCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    isAreaActive: {
        type: Boolean,
        default: true,
    },

    usageCount: {
        type: Number,
        required: true,
        select: false,
        default: 0,
    },

}, {timestamps: true});

// Compound unique index
areaSchema.index({ plant: 1, areaName: 1 }, { unique: true }); 
//Same plant cannot have two areas with the same name
//Different plants can have areas with the same name

export const Area = mongoose.model("Area", areaSchema);