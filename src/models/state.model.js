import mongoose, { Schema } from "mongoose";

const stateSchema = new Schema({
    stateName: {
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

    stateCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    isStateActive: {
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

stateSchema.index({stateName: 1, company: 1}, {unique: true})

export const State = mongoose.model("State", stateSchema);