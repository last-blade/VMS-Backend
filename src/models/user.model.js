import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        index: true,
    },

    department: {
        type: Schema.Types.ObjectId,
        ref: "Department",
        required: true,
        index: true,
    },

    mobile: {
        type: Number,
        required: true,
        trim: true,
        unique: true,
    },

    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
        unique: true,
    },

    plant: {
        type: Schema.Types.ObjectId,
        ref: "Plant",
        required: true,
        index: true,
    },

    signature: {
        type: String,
        required: false,
        default: null,
    },

    accountType: {
        type: Schema.Types.ObjectId,
        ref: "AccountType",
        required: true,
        index: true,
    },

    address: {
        type: String,
        trim: true,
        required: false,
        default: null,
    },

    role: {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true,
    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    refreshToken: {
        type: String,
        required: false,
    },
}, {timestamps: true});

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 12);
        return next();
    }

    return next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
};

userSchema.methods.generateAccessToken = async function(){
    const accessToken = await jwt.sign(
        {
            id: this._id,
            email: this.email,
            fullName: this.fullName,
            accountType: this.accountType,
        },

        process.env.ACCESS_TOKEN_SECRET_KEY,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

    return accessToken;
};

userSchema.methods.generateRefreshToken = async function(){
    const refreshToken = await jwt.sign(
        {
            id: this._id,
        },

        process.env.REFRESH_TOKEN_SECRET_KEY,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

    return refreshToken;
};

export const User = mongoose.model("User", userSchema);