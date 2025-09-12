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
        default: false,
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
            mobile: {
                type: Number,
                required: true,
                index: true,
            },

            fullname: {
                type: String,
                required: true,
                trim: true,
                lowercase: true,
            },

            company: {
                type: String,
                required: false,
                trim: true,
                lowercase: true,
            },

            email: {
                type: String,
                required: false,
                trim: true,
                lowercase: true,
            },

            belongings: [
                {
                    assetName: {
                        type: String,
                        required: false,
                        trim: true,
                        lowercase: true,
                    },
                }
            ]
        }
    ],

    checkedInTime: {
        type: Date,
        required: false,
        index: true,
    },

    checkedOutTime: {
        type: Date,
        required: false,
        index: true,
    },

    appointmentCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
}, {timestamps: true});


appointmentSchema.pre("save", function(next){
    const today = Date.now();
    if(this.appointmentDate < today){
        return next(new Error("Cant't select the past date for appointment"))
    }

    if(this.appointmentValidTill && this.appointmentValidTill < this.appointmentDate){
        return next(new Error("Appointment Valid Till cannot be before appointmentDate"))
    }

    next();
})

export const Appointment = mongoose.model("Appointment", appointmentSchema);