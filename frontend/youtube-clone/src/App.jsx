import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChannelPage from "./pages/ChannelPage";
import CustomizeChannelPage from "./pages/CustomizeChannelPage";
import ManageVideosPage from "./pages/ManageVideosPage";
import CreateChannelPage from "./pages/CreateChannelPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/watch/:id" element={<VideoPlayerPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Channel-related routes */}
      <Route path="/my-channel" element={<ChannelPage />} />
      <Route
        path="/my-channel/customize"
        element={<CustomizeChannelPage />}
      />
      <Route
        path="/my-channel/manage-videos"
        element={<ManageVideosPage />}
      />
      <Route path="/create-channel" element={<CreateChannelPage />} />

      {/* fallback */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;
