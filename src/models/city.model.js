import mongoose, { Schema } from "mongoose";

const citySchema = new Schema({
    cityName: {
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

    state: {
        type: Schema.Types.ObjectId,
        ref: "State",
        required: true,
    },

    cityCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    iscityActive: {
        type: Boolean,
        default: true,
    },

}, {timestamps: true});

export const City = mongoose.model("City", citySchema);