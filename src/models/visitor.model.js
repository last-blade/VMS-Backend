import mongoose, { Schema } from "mongoose";

const visitorSchema = new Schema({
    mobile: {
        type: Number,
        required: true,
        index: true,
    },

    fullname: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

    company: {
        type: String,
        required: false,
        trim: true,
        lowercase: true,
    },

    email: {
        type: String,
        required: false,
        trim: true,
        lowercase: true,
    },

    belongings: [
        {
            assetName: String,
            required: false,
        },
    ]
}, {timestamps: true});

export const Visitor = mongoose.model("Visitor", visitorSchema);