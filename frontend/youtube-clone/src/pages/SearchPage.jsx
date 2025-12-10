import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import Layout from "../components/Layout";
import VideoCard from "../components/VideoCard";

function SearchPage() {
    const { query } = useParams();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/videos?search=${query}`);
                setVideos(res.data);
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [query]);

    return (
        <Layout>
            <h1 className="search-title">Search Results for: {query}</h1>

            {loading && <p>Loading...</p>}

            <div className="video-grid">
                {videos.length === 0 ? (
                    <p>No videos found.</p>
                ) : (
                    videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))
                )}
            </div>
        </Layout>
    );
}

export default SearchPage;
