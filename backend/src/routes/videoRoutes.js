import express from "express";
import Video from "../models/Video.js";
import Channel from "../models/Channel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Small helper: extract youtubeId from a YouTube URL
 * Supports:
 *   https://www.youtube.com/watch?v=XXXX
 *   https://youtu.be/XXXX
 */
function extractYoutubeId(url = "") {
    if (!url) return "";
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return shortMatch[1];

    const longMatch = url.match(/[?&]v=([^?&]+)/);
    if (longMatch) return longMatch[1];

    return "";
}

/**
 * GET /api/videos
 * Optional query params: search, category, channelId
 */
router.get("/", async (req, res) => {
    try {
        const { search, category, channelId } = req.query;

        const filter = {};
        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }
        if (category) {
            filter.category = category;
        }
        if (channelId) {
            filter.channel = channelId;
        }

        const videos = await Video.find(filter)
            .populate("channel", "channelName")
            .sort({ createdAt: -1 });

        res.json(videos);
    } catch (error) {
        console.error("Get videos error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * GET /api/videos/:id
 * Get single video by id
 */
router.get("/:id", async (req, res) => {
    try {
        const videoId = req.params.id;
        const video = await Video.findById(videoId)
            .populate("channel", "channelName description")
            .populate("uploader", "username");

        if (!video) {
            console.warn("Video not found for id:", videoId);
            return res
                .status(404)
                .json({ message: "Video not found", id: videoId });
        }

        res.json(video);
    } catch (error) {
        console.error("Get single video error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * POST /api/videos
 * Body: { title, description, thumbnailUrl, videoUrl, youtubeUrl, youtubeId, category, channelId }
 * You can send either:
 *   - youtubeUrl / youtubeId  (YouTube video)
 *   - videoUrl                (self-hosted file)
 * Schema already allows either youtubeId or videoUrl.
 */
router.post("/", protect, async (req, res) => {
    try {
        const {
            title,
            description,
            thumbnailUrl,
            videoUrl,
            youtubeUrl,
            youtubeId,
            category,
            channelId,
        } = req.body;

        // final youtubeId (from body or from youtubeUrl)
        let finalYoutubeId = youtubeId || extractYoutubeId(youtubeUrl);

        if (!title || (!videoUrl && !finalYoutubeId) || !channelId) {
            return res.status(400).json({
                message:
                    "title, channelId and at least one of videoUrl or youtubeUrl/youtubeId are required",
            });
        }

        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(400).json({ message: "Channel not found" });
        }

        const video = await Video.create({
            title,
            description,
            thumbnailUrl,
            videoUrl,
            youtubeId: finalYoutubeId || undefined,
            category,
            channel: channelId,
            uploader: req.user.id,
        });

        res.status(201).json(video);
    } catch (error) {
        console.error("Create video error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * POST /api/videos/:id/view
 * Increment view count when someone watches a video
 * (no auth needed)
 */
router.post("/:id/view", async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate("channel", "channelName");

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.json(video);
    } catch (error) {
        console.error("Increment view error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * POST /api/videos/:id/like
 * One like per user; if previously disliked, switch reaction.
 */
router.post("/:id/like", protect, async (req, res) => {
    try {
        const userId = req.user.id;

        let video = await Video.findById(req.params.id).populate(
            "channel",
            "channelName"
        );

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const alreadyLiked = video.likedBy.some((u) => u.equals(userId));
        const alreadyDisliked = video.dislikedBy.some((u) => u.equals(userId));

        if (alreadyLiked) {
            // already liked -> do nothing (you could toggle unlike here if you want)
            return res.json(video);
        }

        // if previously disliked, remove that dislike
        if (alreadyDisliked) {
            video.dislikedBy = video.dislikedBy.filter(
                (u) => !u.equals(userId)
            );
            video.dislikes = Math.max(0, (video.dislikes || 0) - 1);
        }

        // add like
        video.likedBy.push(userId);
        video.likes = (video.likes || 0) + 1;

        await video.save();
        video = await video.populate("channel", "channelName");

        res.json(video);
    } catch (error) {
        console.error("Like video error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * POST /api/videos/:id/dislike
 * One dislike per user; if previously liked, switch reaction.
 */
router.post("/:id/dislike", protect, async (req, res) => {
    try {
        const userId = req.user.id;

        let video = await Video.findById(req.params.id).populate(
            "channel",
            "channelName"
        );

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const alreadyLiked = video.likedBy.some((u) => u.equals(userId));
        const alreadyDisliked = video.dislikedBy.some((u) => u.equals(userId));

        if (alreadyDisliked) {
            // already disliked -> do nothing (you could toggle remove here)
            return res.json(video);
        }

        // if previously liked, remove like
        if (alreadyLiked) {
            video.likedBy = video.likedBy.filter((u) => !u.equals(userId));
            video.likes = Math.max(0, (video.likes || 0) - 1);
        }

        // add dislike
        video.dislikedBy.push(userId);
        video.dislikes = (video.dislikes || 0) + 1;

        await video.save();
        video = await video.populate("channel", "channelName");

        res.json(video);
    } catch (error) {
        console.error("Dislike video error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * PUT /api/videos/:id
 * Update a video (only uploader or channel owner)
 */
router.put("/:id", protect, async (req, res) => {
    try {
        const {
            title,
            description,
            thumbnailUrl,
            videoUrl,
            youtubeUrl,
            youtubeId,
            category,
        } = req.body;

        let finalYoutubeId = youtubeId || extractYoutubeId(youtubeUrl);

        // find video with channel populated (to check owner)
        const video = await Video.findById(req.params.id).populate("channel", "owner");
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const isOwner =
            video.uploader.toString() === req.user.id ||
            (video.channel &&
                video.channel.owner &&
                video.channel.owner.toString() === req.user.id);

        if (!isOwner) {
            return res.status(403).json({ message: "Not allowed to edit this video" });
        }

        // Only override fields that were sent
        if (title !== undefined) video.title = title;
        if (description !== undefined) video.description = description;
        if (category !== undefined) video.category = category;
        if (thumbnailUrl !== undefined) video.thumbnailUrl = thumbnailUrl;
        if (videoUrl !== undefined) video.videoUrl = videoUrl;
        if (finalYoutubeId) video.youtubeId = finalYoutubeId;

        await video.save();
        res.json(video);
    } catch (error) {
        console.error("Update video error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * DELETE /api/videos/:id
 * Delete a video (only uploader or channel owner)
 */
router.delete("/:id", protect, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id).populate("channel", "owner");
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const isOwner =
            video.uploader.toString() === req.user.id ||
            (video.channel &&
                video.channel.owner &&
                video.channel.owner.toString() === req.user.id);

        if (!isOwner) {
            return res.status(403).json({ message: "Not allowed to delete this video" });
        }

        await video.deleteOne();
        res.json({ message: "Video deleted" });
    } catch (error) {
        console.error("Delete video error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});


export default router;
