import { Link } from "react-router-dom";

import { AiFillHome, AiFillLike } from "react-icons/ai";
import { SiYoutubeshorts } from "react-icons/si";
import {
    MdSubscriptions,
    MdHistory,
    MdVideoLibrary,
    MdOutlineVideoCameraBack,
    MdWatchLater,
    MdWhatshot,
    MdLocalMovies,
    MdLiveTv
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaMusic } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { IoGameController } from "react-icons/io5";

function Sidebar({ isOpen }) {
    return (
        <aside className={`sidebar ${isOpen ? "" : "sidebar-hidden"}`}>
            <nav>
                {/* MAIN */}
                <ul className="sidebar-group">
                    <li>
                        <Link to="/" className="sidebar-link">
                            <AiFillHome className="icon" />
                            Home
                        </Link>
                    </li>

                    <li>
                        <button className="sidebar-link">
                            <SiYoutubeshorts className="icon" />
                            Shorts
                        </button>
                    </li>

                    <li>
                        <button className="sidebar-link">
                            <MdSubscriptions className="icon" />
                            Subscriptions
                        </button>
                    </li>
                </ul>

                {/* YOU */}
                <p className="sidebar-section-title">You ▾</p>

                <ul className="sidebar-group">
                    <Link to="/my-channel" className="sidebar-link">
                        <CgProfile className="sidebar-icon" />
                        Your channel
                    </Link>

                    <li>
                        <button className="sidebar-link">
                            <MdHistory className="icon" />
                            History
                        </button>
                    </li>

                    <li>
                        <button className="sidebar-link">
                            <MdVideoLibrary className="icon" />
                            Playlists
                        </button>
                    </li>

                    <li>
                        <button className="sidebar-link">
                            <MdOutlineVideoCameraBack className="icon" />
                            Your videos
                        </button>
                    </li>

                    <li>
                        <button className="sidebar-link">
                            <MdWatchLater className="icon" />
                            Watch later
                        </button>
                    </li>

                    <li>
                        <button className="sidebar-link">
                            <AiFillLike className="icon" />
                            Liked videos
                        </button>
                    </li>
                </ul>

                {/* EXPLORE */}
                <p className="sidebar-section-title">Explore</p>

                <ul className="sidebar-group">
                    <li>
                        <button className="sidebar-link">
                            <MdWhatshot className="icon" />
                            Trending
                        </button>
                    </li>

                    <li>
                        <button className="sidebar-link">
                            <FaCartShopping className="icon" />
                            Shopping
                        </button>
                    </li>

                    <li>
                        <button className="sidebar-link">
                            <FaMusic className="icon" />
                            Music
                        </button>
                    </li>

                    <li>
                        <button className="sidebar-link">
                            <MdLocalMovies className="icon" />
                            Movies
                        </button>
                    </li>

                    <li>
                        <button className="sidebar-link">
                            <MdLiveTv className="icon" />
                            Live
                        </button>
                    </li>

                    <li>
                        <button className="sidebar-link">
                            <IoGameController className="icon" />
                            Gaming
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
