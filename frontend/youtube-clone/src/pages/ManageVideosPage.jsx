import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

function ManageVideosPage() {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        title: "",
        description: "",
        thumbnailUrl: "",
        videoUrl: "",
        category: "",
    });

    useEffect(() => {
        const fetchChannel = async () => {
            if (!token) return;
            try {
                setLoading(true);
                const res = await api.get("/channels/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setChannel(res.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    alert("Create your channel first.");
                    navigate("/my-channel/customize");
                } else {
                    console.error(err);
                    alert("Failed to load channel");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchChannel();
    }, [token, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!channel) return;

        try {
            const body = {
                ...form,
                channelId: channel._id,
            };
            await api.post("/videos", body, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Video added!");
            navigate("/my-channel");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add video");
        }
    };

    return (
        <Layout>
            <div className="channel-page">
                <section className="channel-section">
                    <h2>Add video</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <form className="channel-form" onSubmit={handleSubmit}>
                            <label>
                                Title
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Description
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={3}
                                />
                            </label>
                            <label>
                                Thumbnail URL
                                <input
                                    name="thumbnailUrl"
                                    value={form.thumbnailUrl}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Video URL
                                <input
                                    name="videoUrl"
                                    value={form.videoUrl}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Category
                                <input
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                />
                            </label>
                            <button type="submit">Add video</button>
                        </form>
                    )}

                    <button
                        type="button"
                        style={{ marginTop: "12px" }}
                        onClick={() => navigate("/my-channel")}
                    >
                        Back to channel
                    </button>
                </section>
            </div>
        </Layout>
    );
}

export default ManageVideosPage;
