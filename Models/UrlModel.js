import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    alias: {
        type: String,
        unique: true
    },
    topic: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    clicks: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        userAgent: String,
        ipAddress: String,
        geolocation: Object
    }]
});

const URL = mongoose.model("URL", urlSchema);

export default URL;