import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://youtube-clone-backend-2c7m.onrender.com";

function getThumbnailSrc(video) {
    const { youtubeId, thumbnailUrl, thumbnail, thumbnailPath } = video;

    // 1️⃣ If video has a YouTube ID → use YouTube thumbnail
    if (youtubeId) {
        return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }

    // 2️⃣ Then try backend thumbnail fields
    if (thumbnailUrl) return thumbnailUrl;

    if (thumbnailPath && thumbnailPath.startsWith("/uploads")) {
        return `${API_BASE_URL}${thumbnailPath}`;
    }

    if (thumbnail && thumbnail.startsWith("/uploads")) {
        return `${API_BASE_URL}${thumbnail}`;
    }

    if (thumbnail) {
        return `${API_BASE_URL}/uploads/${thumbnail}`;
    }

    // 3️⃣ Fallback
    return "https://via.placeholder.com/320x180?text=Video";
}

function VideoCard({ video }) {
    const viewsText = video.views ? `${video.views} views` : "0 views";
    const uploadDate = video.createdAt
        ? new Date(video.createdAt).toLocaleDateString()
        : "";

    const thumbnailSrc = getThumbnailSrc(video);

    return (
        <div className="video-card">
            <Link to={`/watch/${video._id}`}>
                <div className="thumbnail-wrapper">
                    <img
                        src={thumbnailSrc}
                        alt={video.title}
                        className="thumbnail"
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://via.placeholder.com/320x180?text=Video";
                        }}
                    />
                </div>
            </Link>
            <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-channel">
                    {video.channel?.channelName || "Unknown channel"}
                </p>
                <p className="video-meta">
                    {viewsText} · {uploadDate}
                </p>
            </div>
        </div>
    );
}

export default VideoCard;
