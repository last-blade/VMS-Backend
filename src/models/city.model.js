import mongoose, { Schema } from "mongoose";

const citySchema = new Schema({
    cityName: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        index: true,
    },

    country: {
        type: Schema.Types.ObjectId,
        ref: "Country",
        required: true,
    },

    state: {
        type: Schema.Types.ObjectId,
        ref: "State",
        required: true,
    },

    cityCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    iscityActive: {
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
        default: 0,
    },

}, {timestamps: true});

citySchema.index({ cityName: 1, company: 1 }, { unique: true });

export const City = mongoose.model("City", citySchema);