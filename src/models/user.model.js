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

    accountType: {
        type: String,
        enum: ["Admin", "User"],
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    refreshToken: {
        type: String,
        required: false,
    },
}, {timestamps: true});

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(password, 12);
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