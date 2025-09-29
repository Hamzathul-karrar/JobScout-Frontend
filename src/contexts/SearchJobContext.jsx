import React, { createContext, useContext, useState, useRef, useMemo } from 'react';

const SearchJobContext = createContext();

export const useSearchJobContext = () => {
  const context = useContext(SearchJobContext);
  if (!context) {
    throw new Error('useSearchJobContext must be used within SearchJobProvider');
  }
  return context;
};

export const SearchJobProvider = ({ children }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [paginationMap, setPaginationMap] = useState({});
  
  const groupRefs = useRef({});

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    // State
    jobTitle,
    setJobTitle,
    location,
    setLocation,
    experience,
    setExperience,
    isSearching,
    setIsSearching,
    groups,
    setGroups,
    error,
    setError,
    hasSearched,
    setHasSearched,
    paginationMap,
    setPaginationMap,
    groupRefs,
  }), [
    jobTitle,
    location,
    experience,
    isSearching,
    groups,
    error,
    hasSearched,
    paginationMap,
  ]);

  return (
    <SearchJobContext.Provider value={value}>
      {children}
    </SearchJobContext.Provider>
  );
};
