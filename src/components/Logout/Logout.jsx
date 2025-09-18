import React, { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import './Logout.css';

// Extracted SVG icon to prevent re-creation on every render
const LogoutIcon = (
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
);

// App-specific localStorage keys to clean up
const APP_STORAGE_KEYS = [
  'savedJobs',
  'favoritedJobPortals',
  'userPreferences',
  'jobSearchHistory',
  'applicationHistory',
  // Add other app-specific keys as needed
];

function Logout() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Targeted localStorage cleanup function
  const clearAppData = () => {
    try {
      // Remove only app-specific keys instead of clearing everything
      APP_STORAGE_KEYS.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (keyError) {
          console.warn(`Failed to remove localStorage key: ${key}`, keyError);
        }
      });
    } catch (error) {
      console.error('Error during localStorage cleanup:', error);
      // Don't throw - localStorage cleanup shouldn't prevent logout
    }
  };

  // Memoized event handler to prevent unnecessary function recreation
  const handleLogout = useCallback(async () => {
    const confirmed = window.confirm(
      'Logging out will delete your saved jobs and favorited job portals from this device.\n\nDo you want to continue?'
    );
    if (!confirmed) return;

    setIsLoggingOut(true);

    try {
      // Clear app-specific data with targeted approach
      clearAppData();

      // Perform logout
      await logout();

      toast.success('Successfully logged out!');

    } catch (error) {
      console.error('Logout failed:', error);
      
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  if (!user) {
    return null; // Don't render if user is not logged in
  }

  return (
      <button 
        className="logout-button" 
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
          LogoutIcon
        )}
      </button>
           
  );
}

export default Logout;
