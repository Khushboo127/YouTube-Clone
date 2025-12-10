import Video from "../models/Video.js";

export const addView = async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate("channel");
        if (!video) return res.status(404).json({ message: "Video not found" });
        res.json(video);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to increment views" });
    }
};

export const addLike = async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true }
        ).populate("channel");
        if (!video) return res.status(404).json({ message: "Video not found" });
        res.json(video);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to like video" });
    }
};

export const addDislike = async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            { $inc: { dislikes: 1 } },
            { new: true }
        ).populate("channel");
        if (!video) return res.status(404).json({ message: "Video not found" });
        res.json(video);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to dislike video" });
    }
};
