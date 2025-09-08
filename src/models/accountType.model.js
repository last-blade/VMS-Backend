import mongoose, { Schema } from "mongoose";

const accountTypeSchema = new Schema({

    accountTypeName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

    accountTypeCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

}, {timestamps: true});

export const AccountType = mongoose.model("AccountType", accountTypeSchema);