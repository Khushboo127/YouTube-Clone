import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

function CustomizeChannelPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        channelName: "",
        description: "",
        avatarFile: null, // profile picture file
        bannerFile: null, // banner image file
    });
    const [loading, setLoading] = useState(true);

    // Load existing channel so the text fields are prefilled
    useEffect(() => {
        const fetchChannel = async () => {
            if (!token) return;
            try {
                setLoading(true);
                const res = await api.get("/channels/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setForm((prev) => ({
                    ...prev,
                    channelName: res.data.channelName || "",
                    description: res.data.description || "",
                }));
            } catch (err) {
                if (err.response?.status === 404) {
                    // no channel yet → just set default name
                    setForm((prev) => ({
                        ...prev,
                        channelName: user?.username || "",
                    }));
                } else {
                    console.error("Load channel error:", err);
                    alert("Failed to load channel");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchChannel();
    }, [token, user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        setForm({ ...form, avatarFile: e.target.files[0] || null });
    };

    const handleBannerChange = (e) => {
        setForm({ ...form, bannerFile: e.target.files[0] || null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append("channelName", form.channelName);
            data.append("description", form.description);

            // IMPORTANT: field names must be "avatar" and "banner"
            if (form.avatarFile) data.append("avatar", form.avatarFile);
            if (form.bannerFile) data.append("banner", form.bannerFile);

            await api.post("/channels", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // DO NOT set Content-Type manually; axios will set correct boundary
                },
            });

            alert("Channel updated!");
            navigate("/my-channel");
        } catch (err) {
            console.error("Update channel error:", err.response || err);
            alert(
                err.response?.data?.message || "Failed to update channel"
            );
        }
    };

    return (
        <Layout>
            <div className="channel-page">
                <section className="channel-section">
                    <h2>Customize channel</h2>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <form className="channel-form" onSubmit={handleSubmit}>
                            <label>
                                Channel Name
                                <input
                                    name="channelName"
                                    value={form.channelName}
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
                                Profile picture
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </label>

                            <label>
                                Banner image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBannerChange}
                                />
                            </label>

                            <button type="submit">Update channel</button>
                        </form>
                    )}

                    <button
                        type="button"
                        className="back-btn"
                        onClick={() => navigate("/my-channel")}
                    >
                        Back to channel
                    </button>
                </section>
            </div>
        </Layout>
    );
}

export default CustomizeChannelPage;
