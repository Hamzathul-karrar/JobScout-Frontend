// useJobSearch.js - Updated with API call count handling
import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSearchJobContext } from '../contexts/SearchJobContext';
import { normalizeJobs } from '../utils/jobUtils';

export const useJobSearch = () => {
  const navigate = useNavigate();
  const { makeAuthenticatedRequest, updateUserApiCallCount } = useAuth();
  const {
    jobTitle,
    location,
    experience,
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

      const query = new URLSearchParams({
        jobTitle: jobTitle.trim(),
        location: location.trim(),
        ...(experience ? { experience } : {}),
      }).toString();
      const endpoint = `/searchJob?${query}`;

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

      // Update API call count in localStorage if present in response
      if (data.apiCallCount !== undefined && data.apiCallCount !== null) {
        updateUserApiCallCount(data.apiCallCount);
      }

      // Handle the response properly - backend returns ApiResponse with data field
      let jobsArray = [];
      if (data.data && Array.isArray(data.data)) {
        // Backend returns ApiResponse with data property containing array of JobResult objects
        jobsArray = data.data;
      } else if (Array.isArray(data)) {
        // Fallback: if direct array
        jobsArray = data;
      } else if (data && data.jobs && Array.isArray(data.jobs)) {
        // Fallback: if wrapped in object with jobs property
        jobsArray = data.jobs;
      } else {
        console.warn('Unexpected response format:', data);
        jobsArray = [];
      }

      const normalizedTitle = jobTitle.trim();
      const normalizedLocation = location.trim();
      const normalizedExperience = experience || '';
      const sortedJobs = normalizeJobs(jobsArray);

      const newGroup = {
        id: Date.now(),
        jobTitle: normalizedTitle,
        location: normalizedLocation,
        experience: normalizedExperience,
        createdAt: new Date().toISOString(),
        jobs: sortedJobs,
      };

      // Replace any existing history item with the same title+location (ignore experience)
      const updatedGroups = [
        newGroup,
        ...groups.filter(g => {
          const gTitle = (g?.jobTitle || '').trim().toLowerCase();
          const gLocation = (g?.location || '').trim().toLowerCase();
          return !(gTitle === normalizedTitle.toLowerCase() && gLocation === normalizedLocation.toLowerCase());
        }),
      ];

      const remainingGroupIds = updatedGroups.map(g => g.id);
      const nextPagination = remainingGroupIds.reduce((acc, id) => {
        acc[id] = paginationMap[id] || (id === newGroup.id ? 1 : 1);
        return acc;
      }, {});

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
  }, [jobTitle, location, experience, groups, makeAuthenticatedRequest, navigate, setIsSearching, setError, setHasSearched, setGroups, paginationMap, setPaginationMap]);

  return {
    handleSearch,
  };
};
