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
    },

    isStateActive: {
        type: Boolean,
        default: true,
    },

}, {timestamps: true});

export const State = mongoose.model("State", stateSchema);