import mongoose, { Schema } from "mongoose";

const companyAreaSchema = new Schema({

    companyAreaName: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        index: true,
    },

    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
    },

    plant: {
        type: Schema.Types.ObjectId,
        ref: "Plant",
        required: true,   
    },

    companyAreaCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    isCompanyAreaActive: {
        type: Boolean,
        default: true,
    }
}, {timestamps: true});

companyAreaSchema.index({companyAreaName: 1, company: 1, plant: 1}, {unique: true});

export const CompanyArea = mongoose.model("CompanyArea", companyAreaSchema);