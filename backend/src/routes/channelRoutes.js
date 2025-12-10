import express from "express";
import path from "path";
import multer from "multer";
import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------- Multer setup for image uploads ---------- */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
});

const upload = multer({ storage });

// wrap multer so it only runs for multipart/form-data
const uploadIfMultipart = (req, res, next) => {
    const isMultipart = req.is("multipart/form-data");
    if (!isMultipart) return next(); // skip multer, use normal JSON body
    const handler = upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "banner", maxCount: 1 },
    ]);
    handler(req, res, next);
};

/**
 * POST /api/channels
 * Create or update the logged-in user's channel
 *
 * Accepts EITHER:
 *  - multipart/form-data (with optional avatar/banner files)
 *  - application/json (just channelName + description)
 *
 * Body fields:
 *  - channelName (required)
 *  - description (optional)
 *  - avatar (file, optional)
 *  - banner (file, optional)
 */
router.post("/", protect, uploadIfMultipart, async (req, res) => {
    try {
        const { channelName, description } = req.body;

        if (!channelName) {
            return res
                .status(400)
                .json({ message: "channelName is required" });
        }

        // files (if user selected them & sent multipart/form-data)
        const avatarFile = req.files?.avatar?.[0];
        const bannerFile = req.files?.banner?.[0];

        const avatarUrl = avatarFile
            ? `/uploads/${avatarFile.filename}`
            : undefined;
        const bannerUrl = bannerFile
            ? `/uploads/${bannerFile.filename}`
            : undefined;

        // ONE channel per user: update if exists, otherwise create
        let channel = await Channel.findOne({ owner: req.user.id });

        if (channel) {
            channel.channelName = channelName;
            channel.description =
                description !== undefined ? description : channel.description;

            if (avatarUrl) channel.avatarUrl = avatarUrl;
            if (bannerUrl) channel.bannerUrl = bannerUrl;

            await channel.save();
        } else {
            channel = await Channel.create({
                channelName,
                description,
                avatarUrl: avatarUrl || "",
                bannerUrl: bannerUrl || "",
                owner: req.user.id,
            });
        }

        res.json(channel);
    } catch (error) {
        console.error("Create/update channel error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * GET /api/channels/me
 * Get logged-in user's channel
 */
router.get("/me", protect, async (req, res) => {
    try {
        const channel = await Channel.findOne({ owner: req.user.id });
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }
        res.json(channel);
    } catch (error) {
        console.error("Get my channel error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * GET /api/channels/:id
 * Get channel + its videos
 */
router.get("/:id", async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id).populate(
            "owner",
            "username"
        );
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        const videos = await Video.find({ channel: channel._id }).sort({
            createdAt: -1,
        });

        res.json({ channel, videos });
    } catch (error) {
        console.error("Get channel error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
