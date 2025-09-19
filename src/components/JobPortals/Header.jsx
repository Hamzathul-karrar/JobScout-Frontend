import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useJobPortals } from "../../contexts/JobPortalsContext";

const Header = memo(() => {
  const navigate = useNavigate();
  const { activeTab } = useJobPortals();

  return (
    <header className="portals-header">
      <div className="header-content">
        <div className="brand">
          <h1 className="jobscout-title">JobScout</h1>
        </div>
        <nav className="navigation">
          <button
            className="nav-btn back-btn"
            onClick={() => navigate("/")}
            title="Back to Home"
          >
            ← Back to Home
          </button>
          <button
            className={`nav-btn ${activeTab === "search" ? "active" : ""}`}
            onClick={() => navigate("/search-jobs")}
          >
            🔍 Search career sites
          </button>
        </nav>
      </div>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
