import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSearchJobContext } from '../contexts/SearchJobContext';
import { normalizeJobs } from '../utils/jobUtils';

export const useJobSearch = () => {
  const navigate = useNavigate();
  const { makeAuthenticatedRequest } = useAuth();
  const { 
    jobTitle, 
    location, 
    setIsSearching, 
    setError, 
    setHasSearched, 
    groups, 
    setGroups, 
    paginationMap, 
    setPaginationMap 
  } = useSearchJobContext();
  
  const debounceTimeout = useRef(null);

  const handleSearch = useCallback(async (persistPagination) => {
    if (!jobTitle.trim() || !location.trim()) {
      setError('Please fill in both Job Title and Location fields');
      return;
    }

    // Batch state updates
    setIsSearching(true);
    setError('');
    setHasSearched(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const endpoint = `/searchJob?jobTitle=${encodeURIComponent(jobTitle.trim())}&location=${encodeURIComponent(location.trim())}`;
      const response = await makeAuthenticatedRequest(endpoint, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const jobsArray = data?.jobs || data || [];
      const normalizedTitle = jobTitle.trim();
      const normalizedLocation = location.trim();
      const sortedJobs = normalizeJobs(jobsArray);
      
      const newGroup = {
        id: Date.now(),
        jobTitle: normalizedTitle,
        location: normalizedLocation,
        createdAt: new Date().toISOString(),
        jobs: sortedJobs,
      };
      
      const updatedGroups = [
        newGroup,
        ...groups.filter(g =>
          (g?.jobTitle || '').trim().toLowerCase() !== normalizedTitle.toLowerCase() ||
          (g?.location || '').trim().toLowerCase() !== normalizedLocation.toLowerCase()
        ),
      ];
      
      const nextPagination = { ...paginationMap, [newGroup.id]: 1 };
      
      // Batch state updates
      setGroups(updatedGroups);
      setPaginationMap(nextPagination);
      
      // Debounce localStorage writes
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      
      debounceTimeout.current = setTimeout(() => {
        try {
          localStorage.setItem('searchJobGroups', JSON.stringify(updatedGroups));
        } catch {
          // ignore storage failures
        }
        persistPagination(nextPagination);
      }, 100);
      
    } catch (err) {
      console.error('Search error:', err);
      
      if (err.name === 'AbortError') {
        setError('Request timed out. The server is taking too long to respond. Please try again.');
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to the server. Try again later.');
      } else if (err.message === 'Authentication failed' || err.message === 'Not authenticated') {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
      } else if (err.message.includes('HTTP error! status:') || err.message.includes('Server error:')) {
        setError(`Server error: ${err.message}`);
      } else if (err.message.includes('Failed to parse')) {
        setError('Invalid response from server. Please try again.');
      } else {
        setError(err.message || 'Failed to fetch jobs. Please check your connection and try again.');
      }
    } finally {
      setIsSearching(false);
    }
  }, [jobTitle, location, groups, makeAuthenticatedRequest, navigate, setIsSearching, setError, setHasSearched, setGroups, paginationMap, setPaginationMap]);

  return {
    handleSearch,
  };
};
