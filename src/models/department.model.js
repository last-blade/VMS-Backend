import mongoose, { Schema } from "mongoose";

const departmentSchema = new Schema({

    departmentName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

    headOfDepartment: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },

    departmentCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    isDepartmentActive: {
        type: Boolean,
        default: true,
        index: true,
    },

    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
    },

}, {timestamps: true});

export const Department = mongoose.model("Department", departmentSchema);