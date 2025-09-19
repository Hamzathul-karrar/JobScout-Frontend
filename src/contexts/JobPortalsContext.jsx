import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

import { JOB_PORTALS, STORAGE_KEYS } from "../utils/constants";

const JobPortalsContext = createContext();

export const useJobPortals = () => {
  const context = useContext(JobPortalsContext);
  if (!context) {
    throw new Error("useJobPortals must be used within a JobPortalsProvider");
  }
  return context;
};

export const JobPortalsProvider = ({ children }) => {
  const [favoritePortals, setFavoritePortals] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITE_PORTALS);
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavoritePortals(parsedFavorites);
      } catch (error) {
        console.error("Error parsing saved favorites:", error);
        localStorage.removeItem(STORAGE_KEYS.FAVORITE_PORTALS);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save favorites to localStorage whenever they change (but not during initial load)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(
        STORAGE_KEYS.FAVORITE_PORTALS,
        JSON.stringify(favoritePortals)
      );
    }
  }, [favoritePortals, isInitialized]);

  const toggleFavorite = useCallback((portalId) => {
    setFavoritePortals((prev) => {
      const isAlreadyFavorite = prev.includes(portalId);
      if (isAlreadyFavorite) {
        return prev.filter((id) => id !== portalId);
      } else {
        return [...prev, portalId];
      }
    });
  }, []);

  // Memoize the expensive getFavoritePortals operation
  const favoritePortalsList = useMemo(() => {
    // Filter favorite portals and sort by most recently added (reverse order)
    return JOB_PORTALS
      .filter((portal) => favoritePortals.includes(portal.id))
      .sort((a, b) => {
        const aIndex = favoritePortals.indexOf(a.id);
        const bIndex = favoritePortals.indexOf(b.id);
        // Reverse order so most recently added appears first
        return bIndex - aIndex;
      });
  }, [favoritePortals]);

  const getFavoritePortals = useCallback(() => {
    return favoritePortalsList;
  }, [favoritePortalsList]);

  const handlePortalClick = useCallback((url) => {
    window.open(url, "_blank");
  }, []);

  const handleCardClick = useCallback((e, url) => {
    const action = e.target.closest("[data-action]")?.getAttribute("data-action");
    if (action === "heart") return; // Don't navigate if heart was clicked
    handlePortalClick(url);
  }, [handlePortalClick]);

  const handleHeartClick = useCallback((e, portalId) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(portalId);
  }, [toggleFavorite]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    favoritePortals,
    activeTab,
    setActiveTab,
    jobPortals: JOB_PORTALS,
    toggleFavorite,
    getFavoritePortals,
    handlePortalClick,
    handleCardClick,
    handleHeartClick,
  }), [
    favoritePortals,
    activeTab,
    setActiveTab,
    toggleFavorite,
    getFavoritePortals,
    handlePortalClick,
    handleCardClick,
    handleHeartClick,
  ]);

  return (
    <JobPortalsContext.Provider value={value}>
      {children}
    </JobPortalsContext.Provider>
  );
};
