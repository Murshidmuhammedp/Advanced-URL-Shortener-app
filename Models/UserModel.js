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
    url_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "URL"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;