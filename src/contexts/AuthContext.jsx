import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tolerance for small clock skews in ms
  const CLOCK_SKEW_TOLERANCE_MS = 30000;

  const isJwtExpired = (token) => {
    try {
      if (!token) return true;
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const exp = typeof payload?.exp === 'number' ? payload.exp * 1000 : 0;
      const now = Date.now();
      return exp <= now + CLOCK_SKEW_TOLERANCE_MS;
    } catch {
      return true;
    }
  };

  const attemptTokenRefresh = async (currentUser) => {
    const u = currentUser ?? user;
    if (!u?.refreshToken) throw new Error('Authentication failed');
    const refreshResponse = await apiCall('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: u.refreshToken })
    });
    if (!refreshResponse.ok) throw new Error('Token refresh failed');
    const refreshData = await refreshResponse.json();
    const updatedUser = { ...u, accessToken: refreshData.accessToken, refreshToken: refreshData.refreshToken };
    setUser(updatedUser);
    localStorage.setItem('accessToken', refreshData.accessToken);
    localStorage.setItem('refreshToken', refreshData.refreshToken);
    return updatedUser;
  };

  // Load user data from localStorage on app start
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        if (storedUser && storedToken) {
          setUser({
            ...JSON.parse(storedUser),
            accessToken: storedToken,
            refreshToken: storedRefreshToken
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData) => {
    const { accessToken, refreshToken, ...userInfo } = userData;
    
    // Store in state
    setUser({
      ...userInfo,
      accessToken,
      refreshToken
    });

    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(userInfo));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const logout = async () => {
    try {
      // Call logout API if user is logged in
      if (user?.refreshToken) {
        await apiCall('/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken: user.refreshToken
          })
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear state and localStorage
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  const makeAuthenticatedRequest = async (endpoint, options = {}) => {
    if (!user?.accessToken) {
      throw new Error('Not authenticated');
    }

    // Proactively refresh if token expired
    let workingUser = user;
    if (isJwtExpired(workingUser.accessToken)) {
      try {
        workingUser = await attemptTokenRefresh(workingUser);
      } catch (e) {
        await logout();
        throw new Error('Authentication failed');
      }
    }

    const requestOptions = {
      ...options,
      headers: {
        'Authorization': `Bearer ${workingUser.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    let response = await apiCall(endpoint, requestOptions);

    // If token expired, try to refresh
    if (response.status === 401) {
      try {
        const updatedUser = await attemptTokenRefresh(workingUser);
        // Retry original request with new token
        requestOptions.headers.Authorization = `Bearer ${updatedUser.accessToken}`;
        response = await apiCall(endpoint, requestOptions);
      } catch (refreshError) {
        await logout();
        throw new Error('Authentication failed');
      }
    }

    // Some backends send non-401 with a body mentioning JWT expiry. Detect and retry once.
    if (!response.ok && response.status !== 401) {
      try {
        const cloned = response.clone();
        const bodyText = await cloned.text();
        if (/jwt\s*expired|token\s*expired/i.test(bodyText)) {
          const updatedUser = await attemptTokenRefresh(workingUser);
          requestOptions.headers.Authorization = `Bearer ${updatedUser.accessToken}`;
          response = await apiCall(endpoint, requestOptions);
        }
      } catch {
        // ignore parse errors
      }
    }

    return response;
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading,
    makeAuthenticatedRequest
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
