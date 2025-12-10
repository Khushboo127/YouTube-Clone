import { useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
// import "index.css";
import Layout from "../components/Layout";

function CreateChannelPage() {
    const { token } = useAuth();
    const [channelName, setChannelName] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    const handleCreateChannel = async () => {
        try {
            const res = await api.post(
                "/channels",
                { channelName, description },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMessage("Channel created successfully!");
        } catch (err) {
            setMessage(
                err.response?.data?.message || "Failed to create channel."
            );
        }
    };

    return (
        <Layout>
            <div className="create-channel-page">
                <h1 className="create-channel-title">Create New Channel</h1>

                <div className="create-channel-form">

                    <input
                        type="text"
                        placeholder="Channel Name"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                    />

                    <textarea
                        placeholder="Channel Description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button
                        className="create-channel-btn"
                        onClick={handleCreateChannel}
                    >
                        Create Channel
                    </button>

                    {message && <p>{message}</p>}
                </div>
            </div>
        </Layout>
    );
}

export default CreateChannelPage;
