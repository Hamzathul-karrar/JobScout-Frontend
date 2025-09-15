import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Logout.css';

function Logout() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    const confirmed = window.confirm(
      'Logging out will delete your saved jobs and favorited job portals from this device.\n\nDo you want to continue?'
    );
    if (!confirmed) return;

    setIsLoggingOut(true);
    try {
      try {
        localStorage.clear();
      } catch {}

      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return null; // Don't render if user is not logged in
  }

  return (
    <button 
      className="nav-btn signup" 
      onClick={handleLogout}
      disabled={isLoggingOut}
      aria-label="Logout"
      title="Logout"
    >
      {isLoggingOut ? (
        <span className="loading-spinner">
          <span className="spinner" />
        </span>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      )}
    </button>
  );
}

export default Logout;
