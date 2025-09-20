import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logout from '../Logout/Logout'; // Import the Logout component
import './Navigation.css';

const Navigation = ({ preloadHandlers = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogoClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleJobSearchClick = () => {
    navigate('/search-jobs');
    setIsMobileMenuOpen(false);
  };

  const handleJobPortalsClick = () => {
    navigate('/jobportals');
    setIsMobileMenuOpen(false);
  };

  const handleSignInClick = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleSignUpClick = () => {
    navigate('/register');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePage = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
  };

  return (
    <nav className="top-nav">
      <div className="container">
        <div className="nav-brand" onClick={handleLogoClick}>
          JobScout
        </div>

        {/* Desktop Navigation */}
        <div className="nav-desktop">
          <div className="nav-links">
            <button 
              className={`nav-link ${isActivePage('/') ? 'active' : ''}`}
              onClick={handleLogoClick}
            >
              Home
            </button>
            <button 
              className={`nav-link ${isActivePage('/search-jobs') ? 'active' : ''}`}
              onClick={handleJobSearchClick}
              onMouseEnter={preloadHandlers.searchJobs}
              onFocus={preloadHandlers.searchJobs}
            >
              Job Search
            </button>
            <button 
              className={`nav-link ${isActivePage('/jobportals') ? 'active' : ''}`}
              onClick={handleJobPortalsClick}
              onMouseEnter={preloadHandlers.jobPortals}
              onFocus={preloadHandlers.jobPortals}
            >
              Job Portals
            </button>
          </div>

          <div className="nav-buttons">
            {loading ? (
              <div className="nav-loading">Loading...</div>
            ) : user ? (
              <>
                <Logout 
                  className="nav-btn logout" 
                  onLogoutSuccess={() => {
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                  showText={true}
                  showConfirmation={true}
                />
              </>
            ) : (
              <>
                <button className="nav-btn signin" onClick={handleSignInClick}>
                  Sign In
                </button>
                <button className="nav-btn signup" onClick={handleSignUpClick}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-content">
            <div className="mobile-nav-links">
              <button 
                className={`mobile-nav-link ${isActivePage('/') ? 'active' : ''}`}
                onClick={handleLogoClick}
              >
                Home
              </button>
              <button 
                className={`mobile-nav-link ${isActivePage('/search-jobs') ? 'active' : ''}`}
                onClick={handleJobSearchClick}
                onTouchStart={preloadHandlers.searchJobs}
                onFocus={preloadHandlers.searchJobs}
              >
                Job Search
              </button>
              <button 
                className={`mobile-nav-link ${isActivePage('/jobportals') ? 'active' : ''}`}
                onClick={handleJobPortalsClick}
                onTouchStart={preloadHandlers.jobPortals}
                onFocus={preloadHandlers.jobPortals}
              >
                Job Portals
              </button>
            </div>

            <div className="mobile-nav-buttons">
              {loading ? (
                <div className="nav-loading">Loading...</div>
              ) : user ? (
                <>
                  <Logout 
                    className="mobile-nav-btn logout" 
                    onLogoutSuccess={() => {
                      navigate('/');
                      setIsMobileMenuOpen(false);
                    }}
                    showText={true}
                    showConfirmation={true}
                  />
                </>
              ) : (
                <>
                  <button className="mobile-nav-btn signin" onClick={handleSignInClick}>
                    Sign In
                  </button>
                  <button className="mobile-nav-btn signup" onClick={handleSignUpClick}>
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)} />
        )}
      </div>
    </nav>
  );
};

export default Navigation;
