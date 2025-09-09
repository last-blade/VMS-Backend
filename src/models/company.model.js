import mongoose, { Schema } from "mongoose";

const companySchema = new Schema({

    companyName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        index: true,
    },

    companyCountry: {
        type: Schema.Types.ObjectId,
        ref: "Country",
    },

    companyCity: {
        type: Schema.Types.ObjectId,
        ref: "City",
    },

    companyState: {
        type: Schema.Types.ObjectId,
        ref: "State",
    },

    companyCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    isCompanyActive: {
        type: Boolean,
        default: true,
    }

}, {timestamps: true});

export const Company = mongoose.model("Company", companySchema);