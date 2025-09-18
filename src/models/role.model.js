import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema({
    roleName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
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

    usageCount: {
        type: Number,
        required: true,
        // select: false,
        default: 0,
    },

}, {timestamps: true});

roleSchema.index({roleName: 1, company: 1}, {unique: true})

export const Role = mongoose.model("Role", roleSchema);