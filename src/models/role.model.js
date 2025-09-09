import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema({
    roleName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },

    isRoleActive: {
        type: Boolean,
        default: true,
    },

    roleCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
    },

}, {timestamps: true});

export const Role = mongoose.model("Role", roleSchema);