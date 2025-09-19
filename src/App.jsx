import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"; 
import { useAuth } from "./contexts/AuthContext";
import "./App.css";
import JobPortals from "./components/JobPortals/JobPortals";
import SearchJobGoogle from "./components/SearchJobGoogle";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";

function App() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const handleExplorePortals = () => {
    navigate("/jobportals");
  };

  const handleSearchJobs = () => {
    navigate("/search-jobs");
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <nav className="top-nav">
                <div className="container">
                  <div className="nav-brand">JobScout</div>
                  <div className="nav-buttons">
                    {isLoading ? (
                      <div className="nav-loading">Loading...</div>
                    ) : isAuthenticated() ? (
                      <Logout />
                    ) : (
                      <>
                        <button className="nav-btn signin" onClick={handleSignIn}>
                          Sign In
                        </button>
                        <button className="nav-btn signup" onClick={handleSignUp}>
                          Sign Up
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </nav>
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
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      
      {/* Added Toaster component at the root level */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 4000,
            style: {
              background: '#4caf50',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#f44336',
            },
          },
        }}
      />
    </>
  );
}

export default App;
