import React, { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

// Loading spinner component
const LoadingSpinner = () => (
  <span className="loading-spinner">
    <span className="spinner" />
  </span>
);

// App-specific localStorage keys to clean up
const APP_STORAGE_KEYS = [
  'accessToken',
  'refreshToken',
  'user'
  // Add other app-specific keys as needed
];

function Logout({ 
  className = 'logout-button', 
  onLogoutSuccess,
  showConfirmation = true,
  confirmationMessage = 'Do you want to Logout?'
}) {
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
    if (showConfirmation) {
      const confirmed = window.confirm(confirmationMessage);
      if (!confirmed) return;
    }

    setIsLoggingOut(true);

    try {
      // Clear app-specific data with targeted approach
      clearAppData();

      // Perform logout
      await logout();

      toast.success('Successfully logged out!');

      // Call success callback if provided
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }

    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout, onLogoutSuccess, showConfirmation, confirmationMessage]);

  if (!user) {
    return null; // Don't render if user is not logged in
  }

  return (
    <button 
      className={className} 
      onClick={handleLogout}
      disabled={isLoggingOut}
      aria-label="Logout"
      title="Logout"
    >
      {isLoggingOut ? (
        <LoadingSpinner />
      ) : (
        'Logout' 
      )}
    </button>
  );
}

export default Logout;
