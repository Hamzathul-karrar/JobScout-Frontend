import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import JobPortals from "./components/JobPortals";
import SearchJobGoogle from "./components/SearchJobGoogle";

function App() {
  const navigate = useNavigate();

  const handleExplorePortals = () => {
    navigate("/jobportals");
  };

  const handleSearchJobs = () => {
    navigate("/search-jobs");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <header className="hero">
              <div className="hero-bg" aria-hidden="true"></div>
              <div className="container hero-inner">
                <div className="badge">
                  ⚡ Your Ultimate Job Search Companion
                </div>
                <h1 className="title">JobScout</h1>
                <p className="subtitle">
                  Discover your next career opportunity with JobScout — a
                  single, smart place that aggregates job portals and gives you
                  career search tools to find roles that fit your skills and
                  ambitions. Explore curated listings and apply faster.
                </p>
                <div className="hero-ctas">
                  <button className="cta-btn primary" onClick={handleSearchJobs}>
                    <span className="icon">🔎</span>
                    <span>Explore Jobs Across Career Sites</span>
                  </button>
                  <button
                    className="cta-btn ghost"
                    onClick={handleExplorePortals}
                  >
                    <span className="icon">➜</span>
                    <span>Explore Job Portals</span>
                  </button>
                </div>
              </div>
            </header>

            <section className="why">
              <div className="container">
                <h2>Why Choose JobScout?</h2>
                <p className="section-sub">
                  We make job searching easier by combining the best listings
                  from trusted portals and Google powered search — all in one
                  place.
                </p>
                <div className="features">
                  <div className="feature">
                    <div className="icon">🌐</div>
                    <h3>Comprehensive Coverage</h3>
                    <p>
                      Find opportunities from top job boards and career sites
                      without hopping between multiple platforms.
                    </p>
                  </div>
                  <div className="feature">
                    <div className="icon">🔍</div>
                    <h3>Smart Career Search</h3>
                    <p>
                      Leverage Google-powered search to quickly discover roles
                      that truly match your skills..
                    </p>
                  </div>
                  <div className="feature">
                    <div className="icon">🧑‍💻</div>
                    <h3>Trusted Portals</h3>
                    <p>
                      Explore jobs from a curated list of reputable and reliable
                      portals — safe, relevant, and up to date.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="cta">
              <div className="container">
                <h2>Ready to Find Your Dream Job?</h2>
                <p className="section-sub">
                  Start your job search journey today and discover opportunities
                  that match your skills and aspirations.
                </p>
                <div className="hero-ctas">
                  <button className="cta-btn primary" onClick={handleSearchJobs}>
                    <span className="icon">🔎</span>
                    <span>Explore Jobs Across Career Sites</span>
                  </button>
                  <button
                    className="cta-btn ghost"
                    onClick={handleExplorePortals}
                  >
                    <span className="icon">➜</span>
                    <span>Explore Job Portals</span>
                  </button>
                </div>
              </div>
            </section>

            <footer className="footer">
              <div className="container">
                <div className="brand">JobScout</div>
                <p className="muted">
                  © 2025 JobScout. Connecting talent with opportunity.
                </p>
              </div>
            </footer>
          </div>
        }
      />

      <Route path="/jobportals" element={<JobPortals />} />
      <Route path="/search-jobs" element={<SearchJobGoogle />} />
    </Routes>
  );
}

export default App;
