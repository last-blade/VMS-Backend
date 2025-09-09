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
    },

}, {timestamps: true});

export const Role = mongoose.model("Role", roleSchema);