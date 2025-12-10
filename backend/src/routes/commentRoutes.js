import express from "express";
import Comment from "../models/Comment.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/comments/:videoId
 * Get comments for a video
 */
router.get("/:videoId", async (req, res) => {
    try {
        const comments = await Comment.find({ video: req.params.videoId })
            .populate("user")               // ⬅ full user (includes _id + username)
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        console.error("Get comments error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * POST /api/comments/:videoId
 * Create a comment for a video
 */
router.post("/:videoId", protect, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const comment = await Comment.create({
            video: req.params.videoId,
            user: req.user.id,
            text,
        });

        await comment.populate("user");   // ⬅ full user again

        res.status(201).json(comment);
    } catch (error) {
        console.error("Create comment error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * PUT /api/comments/:id
 * Update a comment (only owner)
 */
router.put("/:id", protect, async (req, res) => {
    try {
        const { text } = req.body;
        const comment = await Comment.findById(req.params.id);

        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not allowed" });
        }

        comment.text = text || comment.text;
        await comment.save();
        await comment.populate("user");

        res.json(comment);
    } catch (error) {
        console.error("Update comment error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * DELETE /api/comments/:id
 * Delete a comment (only owner)
 */
router.delete("/:id", protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not allowed" });
        }

        await comment.deleteOne();

        res.json({ message: "Comment deleted" });
    } catch (error) {
        console.error("Delete comment error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
