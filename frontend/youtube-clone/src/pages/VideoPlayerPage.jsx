import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import SuggestedVideoCard from "../components/SuggestedVideoCard";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FiShare } from "react-icons/fi";
import { MdDownload } from "react-icons/md";


const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function VideoPlayerPage() {
    const { id } = useParams(); // video id from URL
    const { user, token } = useAuth();

    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [commentError, setCommentError] = useState("");

    const [suggested, setSuggested] = useState([]);

    // Fetch video, comments, suggestions
    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                setLoading(true);
                setError("");

                const [videoRes, commentsRes, suggestedRes] = await Promise.all([
                    api.get(`/videos/${id}`),
                    api.get(`/comments/${id}`),
                    api.get("/videos"),
                ]);

                setVideo(videoRes.data);
                setComments(commentsRes.data);

                // filter out the current video from suggestions
                const others = suggestedRes.data.filter((v) => v._id !== id);
                setSuggested(others);
            } catch (err) {
                console.error(err);
                setError("Failed to load video");
            } finally {
                setLoading(false);
            }
        };

        fetchVideoData();
    }, [id]);

    // Count a view when page is opened
    useEffect(() => {
        const addView = async () => {
            try {
                const res = await api.post(`/videos/${id}/view`);
                // update local video state with new view count
                setVideo((prev) => res.data || prev);
            } catch (err) {
                console.error("Failed to increment view", err);
            }
        };
        addView();
    }, [id]);

    // Like / Dislike handlers
    const handleLikeVideo = async () => {
        if (!token) {
            alert("Please login to like videos.");
            return;
        }
        try {
            const res = await api.post(
                `/videos/${id}/like`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setVideo(res.data);
        } catch (err) {
            console.error("Failed to like video", err);
        }
    };

    const handleDislikeVideo = async () => {
        if (!token) {
            alert("Please login to dislike videos.");
            return;
        }
        try {
            const res = await api.post(
                `/videos/${id}/dislike`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setVideo(res.data);
        } catch (err) {
            console.error("Failed to dislike video", err);
        }
    };

    // Comments handlers
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!token) {
            setCommentError("Please login to comment.");
            return;
        }
        if (!commentText.trim()) return;

        try {
            setCommentError("");
            const res = await api.post(
                `/comments/${id}`,
                { text: commentText },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setComments((prev) => [res.data, ...prev]);
            setCommentText("");
        } catch (err) {
            setCommentError(
                err.response?.data?.message || "Failed to add comment"
            );
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!token) return;
        if (!window.confirm("Delete this comment?")) return;

        try {
            await api.delete(`/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComments((prev) => prev.filter((c) => c._id !== commentId));
        } catch (err) {
            alert("Failed to delete comment");
        }
    };

    const handleEditComment = async (comment) => {
        if (!token) return;
        const newText = window.prompt("Edit your comment:", comment.text);
        if (!newText || newText === comment.text) return;

        try {
            const res = await api.put(
                `/comments/${comment._id}`,
                { text: newText },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setComments((prev) =>
                prev.map((c) => (c._id === comment._id ? res.data : c))
            );
        } catch (err) {
            alert("Failed to update comment");
        }
    };

    const formattedDate =
        video?.createdAt &&
        new Date(video.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    const channelName = video?.channel?.channelName || "Unknown channel";
    const channelInitial = channelName.charAt(0).toUpperCase();

    // Build the video source (YouTube or local file)
    const getVideoSource = () => {
        if (!video) return { type: "none", url: "" };

        // If this is a YouTube video
        if (video.youtubeId) {
            return {
                type: "youtube",
                url: `https://www.youtube.com/embed/${video.youtubeId}`,
            };
        }

        // Otherwise, fallback to local videoUrl (if provided)
        if (video.videoUrl) {
            const isAbsolute = video.videoUrl.startsWith("http");
            const url = isAbsolute
                ? video.videoUrl
                : `${API_BASE_URL}${video.videoUrl.startsWith("/") ? "" : "/"
                }${video.videoUrl}`;

            return { type: "html5", url };
        }

        return { type: "none", url: "" };
    };

    const videoSource = getVideoSource();

    return (
        <Layout>
            {loading && <p>Loading video...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && video && (
                <div className="watch-page">
                    {/* LEFT: main video + info + comments */}
                    <div className="watch-main-column">
                        {/* Video player */}
                        <div className="video-player-wrapper">
                            {videoSource.type === "youtube" ? (
                                <iframe
                                    className="video-player"
                                    src={videoSource.url}
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            ) : videoSource.type === "html5" ? (
                                <video
                                    className="video-player"
                                    src={videoSource.url}
                                    controls
                                />
                            ) : (
                                <p>Video source not available.</p>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="video-title-main">{video.title}</h1>

                        {/* Channel row + action buttons */}
                        <div className="video-info-bar">
                            <div className="video-channel-info">
                                <div className="channel-avatar">
                                    {channelInitial}
                                </div>
                                <div className="channel-text">
                                    <p className="video-channel-main">
                                        {channelName}
                                    </p>
                                    <p className="video-channel-subs">
                                        {video.channel?.subscribers
                                            ? `${video.channel.subscribers} subscribers`
                                            : "Channel"}
                                    </p>
                                </div>
                                <button className="subscribe-btn">
                                    Subscribe
                                </button>
                            </div>

                            <div className="video-actions">
                                <button className="action-pill">
                                    <AiOutlineLike size={20} /> Like
                                </button>

                                <button className="action-pill">
                                    <AiOutlineDislike size={20} /> Dislike
                                </button>

                                <button className="action-pill">
                                    <FiShare size={20} /> Share
                                </button>

                                <button className="action-pill">
                                    <MdDownload size={20} /> Download
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="video-description-box">
                            <p className="video-stats-line">
                                {video.views || 0} views · {formattedDate}
                            </p>
                            <p>
                                {video.description ||
                                    "No description provided."}
                            </p>
                        </div>

                        {/* Comments */}
                        <div className="comments-section">
                            <h2>{comments.length} Comments</h2>

                            {user ? (
                                <form
                                    className="comment-form"
                                    onSubmit={handleAddComment}
                                >
                                    <textarea
                                        rows={3}
                                        placeholder="Add a public comment..."
                                        value={commentText}
                                        onChange={(e) =>
                                            setCommentText(e.target.value)
                                        }
                                    />
                                    {commentError && (
                                        <p className="auth-error">
                                            {commentError}
                                        </p>
                                    )}
                                    <button type="submit">Comment</button>
                                </form>
                            ) : (
                                <p>Please login to add comments.</p>
                            )}

                            {comments.length === 0 ? (
                                <p>No comments yet.</p>
                            ) : (
                                <ul className="comments-list">
                                    {comments.map((c) => (
                                        <li
                                            key={c._id}
                                            className="comment-item"
                                        >
                                            <div className="comment-header">
                                                <span className="comment-user">
                                                    {c.user?.username || "User"}
                                                </span>
                                                <span className="comment-date">
                                                    {new Date(
                                                        c.createdAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="comment-text">
                                                {c.text}
                                            </p>

                                            {user &&
                                                c.user &&
                                                (c.user._id === user.id ||
                                                    c.user.username ===
                                                    user.username) && (
                                                    <div className="comment-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEditComment(
                                                                    c
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteComment(
                                                                    c._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: suggested videos */}
                    <aside className="watch-suggestions">
                        {suggested.map((v) => (
                            <SuggestedVideoCard key={v._id} video={v} />
                        ))}
                    </aside>
                </div>
            )}
        </Layout>
    );
}

export default VideoPlayerPage;
