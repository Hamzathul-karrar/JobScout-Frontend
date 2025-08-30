import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JobPortals.css";

const JobPortals = () => {
  const [favoritePortals, setFavoritePortals] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  const jobPortals = [
    {
      id: 1,
      name: "LinkedIn Jobs",
      url: "https://www.linkedin.com/jobs/",
      isFavorite: false,
    },
    {
      id: 2,
      name: "Indeed",
      url: "https://www.indeed.com/",
      isFavorite: false,
    },
    {
      id: 3,
      name: "Glassdoor",
      url: "https://www.glassdoor.co.in/Job/",
      isFavorite: false,
    },
    {
      id: 4,
      name: "Monster",
      url: "https://www.monster.com/",
      isFavorite: false,
    },
    {
      id: 5,
      name: "CareerBuilder",
      url: "https://www.careerbuilder.com/",
      isFavorite: false,
    },
    {
      id: 6,
      name: "ZipRecruiter",
      url: "https://www.ziprecruiter.com/",
      isFavorite: false,
    },
    {
      id: 7,
      name: "SimplyHired",
      url: "https://www.simplyhired.com/",
      isFavorite: false,
    },
    { id: 8, name: "Dice", url: "https://www.dice.com/", isFavorite: false },
    {
      id: 9,
      name: "AngelList",
      url: "https://angel.co/jobs",
      isFavorite: false,
    },
    {
      id: 10,
      name: "Stack Overflow Jobs",
      url: "https://stackoverflow.com/jobs",
      isFavorite: false,
    },
    { id: 11, name: "Remote.co", url: "https://remote.co/", isFavorite: false },
    {
      id: 12,
      name: "WeWorkRemotely",
      url: "https://weworkremotely.com/",
      isFavorite: false,
    },
    {
      id: 13,
      name: "Naukri.com",
      url: "https://www.naukri.com/",
      isFavorite: false,
    },
    {
      id: 14,
      name: "Monster India",
      url: "https://www.monsterindia.com/",
      isFavorite: false,
    },
    {
      id: 15,
      name: "Shine.com",
      url: "https://www.shine.com/",
      isFavorite: false,
    },
    {
      id: 16,
      name: "TimesJobs",
      url: "https://www.timesjobs.com/",
      isFavorite: false,
    },
    {
      id: 17,
      name: "FreshersWorld",
      url: "https://www.freshersworld.com/",
      isFavorite: false,
    },
    {
      id: 18,
      name: "Hirist",
      url: "https://www.hirist.com/",
      isFavorite: false,
    },
    {
      id: 19,
      name: "Foundit.in",
      url: "https://www.foundit.in/",
      isFavorite: false,
    },
    {
      id: 20,
      name: "SimplyHired India",
      url: "https://www.simplyhired.co.in/",
      isFavorite: false,
    },
    {
      id: 21,
      name: "Internshala",
      url: "https://internshala.com/",
      isFavorite: false,
    },
    {
      id: 22,
      name: "Elitmus",
      url: "https://www.elitmus.com/",
      isFavorite: false,
    },
    {
      id: 23,
      name: "Placement India",
      url: "https://www.placementindia.com/",
      isFavorite: false,
    },
    { id: 24, name: "Apna.co", url: "https://apna.co/", isFavorite: false },
    {
      id: 25,
      name: "Way2Fresher",
      url: "https://www.way2fresher.com/",
      isFavorite: false,
    },
    {
      id: 26,
      name: "JumpWhere",
      url: "https://www.jumpwhere.com/",
      isFavorite: false,
    },
    {
      id: 27,
      name: "Prosple India",
      url: "https://in.prosple.com/",
      isFavorite: false,
    },
    {
      id: 28,
      name: "Jobsora India",
      url: "https://in.jobsora.com/",
      isFavorite: false,
    },
    {
      id: 29,
      name: "Jooble India",
      url: "https://in.jooble.org/",
      isFavorite: false,
    },
    {
      id: 30,
      name: "Google Careers Bangalore",
      url: "https://www.google.com/about/careers/applications/locations/bangalore",
      isFavorite: false,
    },
    {
      id: 31,
      name: "Rozgar.com",
      url: "https://rozgar.com/",
      isFavorite: false,
    },
    {
      id: 32,
      name: "LetsIntern",
      url: "https://www.letsintern.com/",
      isFavorite: false,
    },
    {
      id: 33,
      name: "Hirist Tech",
      url: "https://www.hirist.tech/",
      isFavorite: false,
    },
  ];

  const toggleFavorite = (portalId) => {
    setFavoritePortals((prev) => {
      const isAlreadyFavorite = prev.includes(portalId);
      if (isAlreadyFavorite) {
        return prev.filter((id) => id !== portalId);
      } else {
        return [...prev, portalId];
      }
    });
  };

  const getFavoritePortals = () => {
    // Filter favorite portals and sort by most recently added (reverse order)
    return jobPortals
      .filter((portal) => favoritePortals.includes(portal.id))
      .sort((a, b) => {
        const aIndex = favoritePortals.indexOf(a.id);
        const bIndex = favoritePortals.indexOf(b.id);
        // Reverse order so most recently added appears first
        return bIndex - aIndex;
      });
  };

  const handlePortalClick = (url) => {
    window.open(url, "_blank");
  };

  const handlePortalCardClick = (e, url) => {
    e.stopPropagation(); // Prevent heart button click
    handlePortalClick(url);
  };

  const handleHeartClick = (e, portalId) => {
    e.stopPropagation(); // Prevent card click
    toggleFavorite(portalId);
  };

  return (
    <div className="job-portals">
      {/* Header with JobScout branding and navigation */}
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
              onClick={() => setActiveTab("search")}
            >
              🔍 Search Jobs
            </button>
          </nav>
        </div>
      </header>

      <div className="portals-container">
        {/* Favorite Portals Section */}
        <section className="favorite-portals">
          <h2 className="section-title">Favorite Portals</h2>
          {favoritePortals.length === 0 ? (
            <p className="no-favorites">No favorite portals yet.</p>
          ) : (
            <div className="portals-grid">
              {getFavoritePortals().map((portal) => (
                <div
                  key={`favorite-${portal.id}`}
                  className="portal-card favorite"
                  onClick={(e) => handlePortalCardClick(e, portal.url)}
                >
                  <div className="portal-info">
                    <h3 className="portal-name">{portal.name}</h3>
                  </div>
                  <button
                    className="heart-btn favorite"
                    onClick={(e) => handleHeartClick(e, portal.id)}
                    title="Remove from favorites"
                  >
                    ❤️
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* All Job Portals Section */}
        <section className="all-portals">
          <h2 className="section-title">
            All Job Portals
            <span className="portal-count">({jobPortals.length})</span>
          </h2>
          <div className="portals-grid">
            {jobPortals
              .filter((portal) => portal && portal.name && portal.url) // Filter out any invalid portals
              .map((portal) => (
                <div 
                  key={`portal-${portal.id}`} 
                  className="portal-card"
                  onClick={(e) => handlePortalCardClick(e, portal.url)}
                >
                  <div className="portal-info">
                    <h3 className="portal-name">{portal.name}</h3>
                  </div>
                  <button
                    className={`heart-btn ${
                      favoritePortals.includes(portal.id) ? "favorite" : ""
                    }`}
                    onClick={(e) => handleHeartClick(e, portal.id)}
                    title={
                      favoritePortals.includes(portal.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {favoritePortals.includes(portal.id) ? "❤️" : "🤍"}
                  </button>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobPortals;
