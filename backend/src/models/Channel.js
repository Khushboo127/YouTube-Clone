import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
    {
        channelName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subscribers: {
            type: Number,
            default: 0,
        },
        // NEW: profile picture + banner
        avatarUrl: {
            type: String,
            default: "",
        },
        bannerUrl: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
