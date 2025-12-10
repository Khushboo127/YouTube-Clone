import { Link } from "react-router-dom";

function SuggestedVideoCard({ video }) {
    const viewsText = video.views ? `${video.views} views` : "0 views";

    return (
        <Link to={`/watch/${video._id}`} className="suggested-card">
            <div className="suggested-thumb-wrapper">
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="suggested-thumb"
                />
            </div>
            <div className="suggested-info">
                <p className="suggested-title">{video.title}</p>
                <p className="suggested-channel">
                    {video.channel?.channelName || "Unknown channel"}
                </p>
                <p className="suggested-meta">{viewsText}</p>
            </div>
        </Link>
    );
}

export default SuggestedVideoCard;
