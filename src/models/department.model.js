import mongoose, { Schema } from "mongoose";

const departmentSchema = new Schema({

    departmentName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
    },

    headOfDepartment: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        index: true,
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

departmentSchema.index({departmentName: 1, company: 1}, {unique: true})

export const Department = mongoose.model("Department", departmentSchema);