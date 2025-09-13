import mongoose, { Schema } from "mongoose";

const countrySchema = new Schema({
    countryName: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        index: true,
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
    },

}, {timestamps: true});

countrySchema.index({countryName: 1, company: 1}, {unique: true})

export const Country = mongoose.model("Country", countrySchema);