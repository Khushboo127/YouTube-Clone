// src/components/VideoGrid.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client";
import VideoCard from "./VideoCard";

function VideoGrid() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();

    // Extract ?search= from URL
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);

                // Build URL dynamically
                const url = search
                    ? `/videos?search=${encodeURIComponent(search)}`
                    : "/videos";

                const res = await api.get(url);
                setVideos(res.data);
            } catch (err) {
                console.error("Error loading videos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [search]); // refetch when search changes ✔

    if (loading) {
        return <p>Loading videos...</p>;
    }

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
