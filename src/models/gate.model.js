import mongoose, { Schema } from "mongoose";

const gateSchema = new Schema({

    gateName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

    gateNumber: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

    gateInchargeName: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },

    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },

    plant: {
        type: Schema.Types.ObjectId,
        ref: "Plant",
        required: true,
    },

    gateOpenTime: {
        type: Date,
        required: true,
    },

    gateCloseTime: {
        type: Date,
        required: true,
    },

    gateSecurity: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    isgateActive: {
        type: Boolean,
        default: true,
    },

    gateCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

}, {timestamps: true});

export const Gate = mongoose.model("Gate", gateSchema);