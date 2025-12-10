// src/components/VideoGrid.jsx
import VideoCard from "./VideoCard";

function VideoGrid({ videos, search }) {
    if (!videos || videos.length === 0) {
        return (
            <p>
                No videos found
                {search ? ` for "${search}"` : ""}.
            </p>
        );
    }

    return (
        <div className="video-grid">
            {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
            ))}
        </div>
    );
}

export default VideoGrid;
