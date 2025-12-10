// src/pages/HomePage.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import VideoGrid from "../components/VideoGrid";
import FilterBar from "../components/FilterBar";
import api from "../api/client";

/**
 * Returns true if the given video should be shown
 * for the selected filter label (ex: "React", "Music").
 */
function matchesFilter(video, filterLabel) {
    if (!video) return false;
    if (!filterLabel || filterLabel === "All") return true;

    const label = filterLabel.toLowerCase();

    const title = (video.title || "").toLowerCase();
    const category = (video.category || "").toLowerCase();
    const description = (video.description || "").toLowerCase();
    const tagsArray = Array.isArray(video.tags) ? video.tags : [];
    const tags = tagsArray.map((t) => String(t).toLowerCase());

    // match against: title, category, description, tags
    return (
        title.includes(label) ||
        category.includes(label) ||
        description.includes(label) ||
        tags.some((t) => t.includes(label))
    );
}

function HomePage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("All");

    // read ?search= from URL (for search bar)
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const searchTerm = params.get("search") || "";

    // Fetch videos (optionally filtered by search)
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                setError("");

                const url = searchTerm
                    ? `/videos?search=${encodeURIComponent(searchTerm)}`
                    : "/videos";

                const res = await api.get(url);
                setVideos(res.data);
            } catch (err) {
                console.error("Failed to load videos:", err);
                setError("Failed to load videos");
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [searchTerm]);

    // Apply filter chip on top of the fetched list
    const filteredVideos = useMemo(
        () => videos.filter((v) => matchesFilter(v, selectedFilter)),
        [videos, selectedFilter]
    );

    return (
        <Layout>
            <div className="home-page">
                <FilterBar
                    selectedFilter={selectedFilter}
                    onChange={setSelectedFilter}
                />

                {loading && <p>Loading videos...</p>}
                {error && <p>{error}</p>}
                {!loading && !error && (
                    <VideoGrid videos={filteredVideos} search={searchTerm} />
                )}
            </div>
        </Layout>
    );
}

export default HomePage;
