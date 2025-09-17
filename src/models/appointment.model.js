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
        required: true,
        index: true,
    },

    // isAppointmentExtended: {
    //     type: Boolean,
    //     default: false,
    //     index: true,
    // },

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
        default: null,
    },

    checkedOutTime: {
        type: Date,
        required: false,
        index: true,
        default: null,
    },

    appointmentId: {
        type: String,
        required: false,
        trim: true,
        unique: true,
        index: true,
    },

    appointmentStatus: {
        type: String,
        enum: ["Approved", "Rejected"],
        default: "Rejected",
        index: true,
    },

    isAppointmentActive: {
        type: Boolean,
        default: false,
        index: true,
    },

    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
    },

    appointmentCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        index: true,
    },

    // checkedInBy: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //     default: null,
    // },

    // checkedOutBy: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //     default: null,
    // },
}, {timestamps: true});


appointmentSchema.pre("save", function(next){
    const today = Date.now();
    today.setHours(0, 0, 0, 0);
    if(this.appointmentDate < today){
        return next(new Error("Cant't select the past date for appointment"))
    }

    if(this.appointmentValidTill && this.appointmentValidTill < this.appointmentDate){
        return next(new Error("Appointment Valid Till cannot be before appointmentDate"))
    }

    if (!this.appointmentId) {
        this.appointmentId = `APT-${this._id.toString().slice(-8).toUpperCase()}`;
    }

    next();
})

export const Appointment = mongoose.model("Appointment", appointmentSchema);