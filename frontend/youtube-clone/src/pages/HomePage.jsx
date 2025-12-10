// src/pages/HomePage.jsx
import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import VideoGrid from "../components/VideoGrid";
import FilterBar from "../components/FilterBar";
import api from "../api/client";

function matchesFilter(video, filterKey) {
    if (!video) return false;
    if (filterKey === "ALL") return true;

    const title = (video.title || "").toLowerCase();
    const category = (video.category || "").toLowerCase();

    switch (filterKey) {
        case "4K":
            return category.includes("4k");
        case "JAVASCRIPT":
            return category === "javascript" || title.includes("javascript");
        case "REACT":
            return category === "react" || title.includes("react");
        case "DATA_STRUCTURES":
            return (
                category.includes("data structure") ||
                title.includes("data structure")
            );
        case "COMPLEX_NUMBERS":
            return (
                category.includes("complex") ||
                title.includes("complex number")
            );
        case "MUSIC":
            return category === "music" || title.includes("music") || title.includes("lofi");
        case "GAMING":
            return category === "gaming" || title.includes("game");
        case "OOP":
            return (
                category.includes("oop") ||
                title.includes("object oriented") ||
                title.includes("oop")
            );
        case "AI":
            return category === "ai" || title.includes("ai") || title.includes("machine learning");
        case "INDIAN_POP":
            return (
                title.includes("indian") ||
                title.includes("bollywood") ||
                title.includes("hindi") ||
                category.includes("indian")
            );
        default:
            return true;
    }
}

function HomePage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("ALL");

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await api.get("/videos");
                setVideos(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load videos");
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

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
                    <VideoGrid videos={filteredVideos} />
                )}
            </div>
        </Layout>
    );
}

export default HomePage;
