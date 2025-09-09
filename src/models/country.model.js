import mongoose, { Schema } from "mongoose";

const countrySchema = new Schema({
    countryName: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
    },

    countryCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    isCountryActive: {
        type: Boolean,
        default: true,
    },

}, {timestamps: true});

export const Country = mongoose.model("Company", countrySchema);