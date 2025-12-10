import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (!query.trim()) return;
        navigate(`/search/${query}`);
    };

    return (
        <nav className="navbar">
            <input
                type="text"
                className="search-input"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search-btn" onClick={handleSearch}>
                Search
            </button>
        </nav>
    );
}

export default Navbar;
