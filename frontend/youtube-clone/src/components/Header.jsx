import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AiOutlinePlus } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

function Header({ onToggleSidebar }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // keep input in sync with ?search= in the URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearchTerm(params.get("search") || "");
    }, [location.search]);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/");
    };

    const handleViewChannel = () => {
        setMenuOpen(false);
        navigate("/my-channel");
    };

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const userInitial = user?.username
        ? user.username.charAt(0).toUpperCase()
        : "U";

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const term = searchTerm.trim();

        if (!term) {
            // empty => go back to normal home (no filter)
            navigate("/");
            return;
        }

        // go to home with ?search=
        navigate(`/?search=${encodeURIComponent(term)}`);
    };

    return (
        <header className="header">
            <div className="header-left">
                {/* Hamburger */}
                <button
                    className="hamburger-btn"
                    type="button"
                    onClick={onToggleSidebar}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <Link to="/" className="logo">
                    <h3 className="youtube-logo">
                        <FaYoutube className="youtube-icon" />
                        <span className="youtube-logo-text">YouTube</span>
                    </h3>
                </Link>
            </div>

            {/* SEARCH */}
            <div className="header-center">
                <form
                    className="search-container"
                    onSubmit={handleSearchSubmit}
                >
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                        <IoSearch size={20} />
                    </button>
                </form>
            </div>

            <div className="header-right">
                <Link to="/create-channel">
                    <button className="create-btn">
                        <AiOutlinePlus className="create-icon" />
                        Create
                    </button>
                </Link>

                {user ? (
                    <div className="user-menu">
                        <button
                            type="button"
                            className="user-avatar-btn"
                            onClick={toggleMenu}
                        >
                            <span className="user-avatar-circle">
                                {userInitial}
                            </span>
                        </button>

                        {menuOpen && (
                            <div className="user-menu-dropdown">
                                <div className="user-menu-header">
                                    <div className="user-avatar-circle small">
                                        {userInitial}
                                    </div>
                                    <div className="user-menu-text">
                                        <p className="user-menu-name">
                                            {user.username}
                                        </p>
                                        <p className="user-menu-handle">
                                            @
                                            {user.username
                                                .toLowerCase()
                                                .replace(/\s+/g, "")}
                                        </p>
                                        <button
                                            type="button"
                                            className="user-menu-link"
                                            onClick={handleViewChannel}
                                        >
                                            View your channel
                                        </button>
                                    </div>
                                </div>

                                <div className="user-menu-separator" />

                                <button
                                    type="button"
                                    className="user-menu-item"
                                    onClick={handleLogout}
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        className="pill-btn"
                        onClick={() => navigate("/login")}
                    >
                        Sign in
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;
