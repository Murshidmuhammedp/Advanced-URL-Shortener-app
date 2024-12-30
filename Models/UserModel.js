import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
    },
    email: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;