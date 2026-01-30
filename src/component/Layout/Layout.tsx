import { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.css";

const Layout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar onToggle={setIsSidebarExpanded} />

        <main
          className="main-content"
          style={{
            marginLeft:
              windowWidth >= 850 ? (isSidebarExpanded ? "280px" : "70px") : "0",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
