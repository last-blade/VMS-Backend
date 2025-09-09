import mongoose, { Schema } from "mongoose";

const stateSchema = new Schema({
    stateName: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
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
        unique: true,
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

}, {timestamps: true});

export const State = mongoose.model("State", stateSchema);