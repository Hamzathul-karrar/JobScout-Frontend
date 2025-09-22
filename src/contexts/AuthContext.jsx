import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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

  const CLOCK_SKEW_TOLERANCE_MS = 30000;

  // Cache for decoded JWT payloads
  const jwtCache = useMemo(() => new Map(), []);

  // Memoized JWT expiration check
  const isJwtExpired = useCallback((token) => {
    try {
      if (!token) return true;

      // Check cache first
      if (jwtCache.has(token)) {
        const payload = jwtCache.get(token);
        const exp = typeof payload?.exp === 'number' ? payload.exp * 1000 : 0;
        const now = Date.now();
        return exp <= now + CLOCK_SKEW_TOLERANCE_MS;
      }

      const parts = token.split('.');
      if (parts.length !== 3) return true;

      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      // Cache the payload with size limit
      if (jwtCache.size > 10) {
        const firstKey = jwtCache.keys().next().value;
        jwtCache.delete(firstKey);
      }
      jwtCache.set(token, payload);

      const exp = typeof payload?.exp === 'number' ? payload.exp * 1000 : 0;
      const now = Date.now();
      return exp <= now + CLOCK_SKEW_TOLERANCE_MS;
    } catch {
      return true;
    }
  }, [jwtCache]);

  const attemptTokenRefresh = useCallback(async (currentUser) => {
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

    // Batch updates for performance
    requestAnimationFrame(() => {
      localStorage.setItem('accessToken', refreshData.accessToken);
      localStorage.setItem('refreshToken', refreshData.refreshToken);
    });

    return updatedUser;
  }, [user]);

  const login = useCallback((userData) => {
    const { accessToken, refreshToken, ...userInfo } = userData;

    setUser({
      ...userInfo,
      accessToken,
      refreshToken
    });

    localStorage.setItem('user', JSON.stringify(userInfo));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (user?.refreshToken) {
        await apiCall('/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken: user.refreshToken
          }),
          timeoutMs: 1500
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }, [user?.refreshToken]);

  const makeAuthenticatedRequest = useCallback(async (endpoint, options = {}) => {
    if (!user?.accessToken) {
      throw new Error('Not authenticated');
    }

    let workingUser = user;
    if (isJwtExpired(workingUser.accessToken)) {
      try {
        workingUser = await attemptTokenRefresh(workingUser);
      } catch (e) {
        await logout();
        throw new Error('Authentication failed');
      }
    }

    // Reuse headers object for efficiency
    const headers = {
      'Authorization': `Bearer ${workingUser.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const requestOptions = {
      ...options,
      headers
    };

    let response = await apiCall(endpoint, requestOptions);

    if (response.status === 401) {
      try {
        const updatedUser = await attemptTokenRefresh(workingUser);
        headers.Authorization = `Bearer ${updatedUser.accessToken}`;
        response = await apiCall(endpoint, requestOptions);
      } catch (refreshError) {
        await logout();
        throw new Error('Authentication failed');
      }
    }

    // Detect JWT expiry by body, too
    if (!response.ok && response.status !== 401) {
      try {
        const cloned = response.clone();
        const bodyText = await cloned.text();
        if (/jwt\s*expired|token\s*expired/i.test(bodyText)) {
          const updatedUser = await attemptTokenRefresh(workingUser);
          headers.Authorization = `Bearer ${updatedUser.accessToken}`;
          response = await apiCall(endpoint, requestOptions);
        }
      } catch {
        // ignore parse errors
      }
    }

    return response;
  }, [user, isJwtExpired, attemptTokenRefresh, logout]);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUser = () => {
      try {
        const [storedUser, storedToken, storedRefreshToken] = [
          localStorage.getItem('user'),
          localStorage.getItem('accessToken'),
          localStorage.getItem('refreshToken')
        ];

        if (storedUser && storedToken) {
          setUser({
            ...JSON.parse(storedUser),
            accessToken: storedToken,
            refreshToken: storedRefreshToken
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        ['user', 'accessToken', 'refreshToken'].forEach(key =>
          localStorage.removeItem(key)
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const isAuthenticated = user !== null;

  // Memoize the context value
  const value = useMemo(() => ({
    user,
    login,
    logout,
    isAuthenticated,
    isLoading,
    makeAuthenticatedRequest
  }), [
    user,
    login,
    logout,
    isAuthenticated,
    isLoading,
    makeAuthenticatedRequest
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
