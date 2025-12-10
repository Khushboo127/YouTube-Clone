import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleToggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="app-layout">
            <Header onToggleSidebar={handleToggleSidebar} />
            <div className="app-body">
                <Sidebar isOpen={isSidebarOpen} />
                <main className="main-content">{children}</main>
            </div>
        </div>
    );
}

export default Layout;
