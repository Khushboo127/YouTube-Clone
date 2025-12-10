import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import VideoCard from "../components/VideoCard";

// ✅ Base URL of your backend (for /uploads)
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "https://youtube-clone-backend-2c7m.onrender.com";

// ✅ Helper: turn "/uploads/xyz.jpg"
function buildImageUrl(url) {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function ChannelPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChannelAndVideos = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const res = await api.get("/channels/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setChannel(res.data);

                const vidsRes = await api.get(`/videos?channelId=${res.data._id}`);
                setVideos(vidsRes.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    // no channel yet – send user to customize page
                    navigate("/my-channel/customize");
                } else {
                    console.error(err);
                    alert("Failed to load channel");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchChannelAndVideos();
    }, [token, navigate]);

    const channelName = channel?.channelName || user?.username || "My Channel";
    const handle =
        "@" +
        channelName
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/[^a-z0-9_]/g, "");

    const avatarInitial = channelName.charAt(0).toUpperCase();

    // 🔹 Go to manage-videos page to edit this specific video
    const handleEditVideo = (videoId) => {
        navigate(`/my-channel/manage-videos?videoId=${videoId}`);
    };

    // 🔹 Delete a video and remove it from UI
    const handleDeleteVideo = async (videoId) => {
        if (!token) return;
        if (!window.confirm("Do you really want to delete this video?")) return;

        try {
            await api.delete(`/videos/${videoId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setVideos((prev) => prev.filter((v) => v._id !== videoId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete video");
        }
    };

    return (
        <Layout>
            <div className="channel-page">
                {loading ? (
                    <p>Loading channel...</p>
                ) : (
                    <>
                        {/* Header */}
                        <div className="channel-header">
                            <div className="channel-banner">
                                {channel?.bannerUrl && (
                                    <img
                                        src={buildImageUrl(channel.bannerUrl)}
                                        alt="Channel banner"
                                        className="channel-banner-img"
                                    />
                                )}
                            </div>
                            <div className="channel-header-content">
                                <div className="channel-avatar-large">
                                    {channel?.avatarUrl ? (
                                        <img
                                            src={buildImageUrl(channel.avatarUrl)}
                                            alt={channelName}
                                        />
                                    ) : (
                                        avatarInitial
                                    )}
                                </div>
                                <div className="channel-header-text">
                                    <h1>{channelName}</h1>
                                    <p className="channel-handle">{handle}</p>
                                    <p className="channel-subs">
                                        {videos.length} videos
                                    </p>
                                    <p className="channel-about-short">
                                        {channel?.description ||
                                            "Tell viewers about your channel."}
                                    </p>
                                </div>
                                <div className="channel-header-actions">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/my-channel/customize")
                                        }
                                    >
                                        Customize channel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/my-channel/manage-videos")
                                        }
                                    >
                                        Manage videos
                                    </button>
                                </div>
                            </div>
                            <div className="channel-tabs">
                                <button className="active">Home</button>
                                <button disabled>Posts</button>
                            </div>
                        </div>

                        {/* Your videos */}
                        <section className="channel-section">
                            <h2>Your videos</h2>
                            {videos.length === 0 ? (
                                <p>No videos yet.</p>
                            ) : (
                                <div className="video-grid">
                                    {videos.map((v) => (
                                        <div
                                            key={v._id}
                                            className="channel-video-wrapper"
                                        >
                                            <VideoCard video={v} />

                                            <div className="channel-video-actions">
                                                <button
                                                    type="button"
                                                    className="channel-video-btn"
                                                    onClick={() =>
                                                        handleEditVideo(v._id)
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="channel-video-btn danger"
                                                    onClick={() =>
                                                        handleDeleteVideo(v._id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </Layout>
    );
}

export default ChannelPage;
