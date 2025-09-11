import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema({
    plant: {
        type: Schema.Types.ObjectId,
        ref: "Plant",
        required: true,
        index: true,
    },

    department: {
        type: Schema.Types.ObjectId,
        ref: "Department",
        required: true,
        index: true,
    },

    personToVisit: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    areaToVisit: {
        type: Schema.Types.ObjectId,
        ref: "Area",
        required: true,
    },

    appointmentDate: {
        type: Date,
        required: true,
        index: true,
    },

    appointmentValidTill: {
        type: Date,
        required: false,
        index: true,
    },

    isAppointmentExtended: {
        type: Boolean,
        required: false,
        index: true,
    },

    purposeOfVisit: {
        type: String,
        enum: ["Interview", "Service", "Meeting", "Training", "Others"],
        required: true,
        index: true,
    },

    visitors: [
        {
            type: Schema.Types.ObjectId,
            ref: "Visitor",
            required: true,
        }
    ],
}, {timestamps: true});

export const Appointment = mongoose.model("Appointment", appointmentSchema);