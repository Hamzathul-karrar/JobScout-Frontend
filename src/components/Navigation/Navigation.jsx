import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logout from '../Logout/Logout'; // Import the Logout component
import './Navigation.css';

const Navigation = ({ preloadHandlers = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the dropdown ref exists and the click target is outside it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Additional check for logout button elements that might be rendered outside the dropdown
        const isLogoutButton = event.target.closest('.profile-logout-btn, [class*="logout"]');
        if (!isLogoutButton) {
          setIsProfileDropdownOpen(false);
        }
      }
    };

    // Use capture phase to ensure this runs before other event handlers
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, []);

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

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const isActivePage = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogoutSuccess = () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const ProfileDropdown = ({ user, onLogout }) => (
    <div 
      className="profile-dropdown" 
      onClick={(e) => {
        // Prevent the dropdown from closing when clicking inside
        e.stopPropagation();
        e.preventDefault();
      }}
      onMouseDown={(e) => {
        // Also prevent on mousedown to catch all interactions
        e.stopPropagation();
      }}
    >
      <div className="profile-dropdown-content">
        <div className="profile-info">
          <div className="profile-avatar-large">
            {getInitials(user.fullName)}
          </div>
          <div className="profile-details">
            <div className="profile-name">{user.fullName}</div>
            <div className="profile-email">{user.email}</div>
          </div>
        </div>
        
        <div className="profile-divider"></div>
        
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-label">API Usage</span>
            <span className="profile-stat-value">{user.apiCallCount || 0}</span>
          </div>
        </div>
        
        <div className="profile-divider"></div>
        
        <div 
          className="profile-actions"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Logout
            onLogoutSuccess={handleLogoutSuccess}
            showText={true}
            showConfirmation={true}
            className="profile-logout-btn"
          />
        </div>
      </div>
    </div>
  );

  const ProfileIcon = ({ user, onClick }) => (
    <div className="profile-icon-container" onClick={onClick}>
      <div className="profile-avatar">
        {getInitials(user.fullName)}
      </div>
      <svg className="profile-dropdown-arrow" width="12" height="12" viewBox="0 0 12 12">
        <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );

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
            >
              Job Search
            </button>
            <button 
              className={`nav-link ${isActivePage('/jobportals') ? 'active' : ''}`}
              onClick={handleJobPortalsClick}
            >
              Job Portals
            </button>
          </div>

          <div className="nav-buttons">
            {loading ? (
              <div className="nav-loading">Loading...</div>
            ) : user ? (
              <div className="profile-dropdown-wrapper" ref={dropdownRef}>
                <ProfileIcon user={user} onClick={toggleProfileDropdown} />
                {isProfileDropdownOpen && (
                  <ProfileDropdown
                    user={user}
                    onLogout={handleLogoutSuccess}
                  />
                )}
              </div>
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

        {/* Mobile Profile Icon and Hamburger */}
        <div className="mobile-header-actions">
          {user && (
            <div className="mobile-profile-wrapper" ref={dropdownRef}>
              <ProfileIcon user={user} onClick={toggleProfileDropdown} />
              {isProfileDropdownOpen && (
                <ProfileDropdown
                  user={user}
                  onLogout={handleLogoutSuccess}
                />
              )}
            </div>
          )}
          
          {/* Mobile Hamburger Button */}
          <button 
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

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
              >
                Job Search
              </button>
              <button 
                className={`mobile-nav-link ${isActivePage('/jobportals') ? 'active' : ''}`}
                onClick={handleJobPortalsClick}
              >
                Job Portals
              </button>
            </div>

            <div className="mobile-nav-buttons">
              {loading ? (
                <div className="mobile-nav-user">Loading...</div>
              ) : user ? null : (
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
