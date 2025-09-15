import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Logout.css';

function Logout() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
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
    >
      {isLoggingOut ? (
        <span className="loading-spinner">
          <span className="spinner" />
          Logging out...
        </span>
      ) : (
        'Logout'
      )}
    </button>
  );
}

export default Logout;
