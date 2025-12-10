import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: String,

        // For custom thumbnails (optional).
        // For YouTube videos, frontend will usually build thumbnail from `youtubeId`.
        thumbnailUrl: String,

        // Local video file URL (optional if youtubeId is present)
        videoUrl: {
            type: String,
            required: function () {
                // required only when youtubeId is NOT set
                return !this.youtubeId;
            },
        },

        // For YouTube videos
        youtubeId: {
            type: String, // e.g. "Ke90Tje7VS0"
            // not required, because some videos may use local videoUrl instead
        },

        category: String,

        channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel",
            required: true,
        },
        uploader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // counters
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },

        // NEW: per-user reactions
        likedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        dislikedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

// ✅ Extra safety: make sure at least ONE of youtubeId or videoUrl exists
videoSchema.pre("validate", function (next) {
    if (!this.youtubeId && !this.videoUrl) {
        this.invalidate(
            "youtubeId",
            "Either youtubeId or videoUrl must be provided."
        );
        this.invalidate(
            "videoUrl",
            "Either youtubeId or videoUrl must be provided."
        );
    }
    next();
});

export default mongoose.model("Video", videoSchema);
