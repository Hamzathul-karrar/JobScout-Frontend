import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchJobGoogle.css';

// Helpers kept module-scoped so they are stable and reusable
const toTimestamp = (value) => {
  const d = new Date(value);
  return isNaN(d) ? 0 : d.getTime();
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'N/A';
  }
};

const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Normalize a jobs array: sort and precompute display fields to reduce render-time work
const normalizeJobs = (jobs) => {
  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const sorted = [...safeJobs].sort((a, b) => toTimestamp(b?.postedDate) - toTimestamp(a?.postedDate));
  return sorted.map((job) => ({
    ...job,
    companyDisplay: job?.company || 'N/A',
    titleDisplay: job?.title || 'N/A',
    descriptionShort: truncateText(job?.description || 'No description available'),
    postedDateDisplay: formatDate(job?.postedDate),
    linkHref: job?.link || '',
  }));
};

const JobRow = memo(({ job }) => {

  return (
    <tr className="job-row">
      <td className="company-cell">
        <strong>{job.companyDisplay}</strong>
      </td>
      <td className="title-cell">
        <strong>{job.titleDisplay}</strong>
      </td>
      <td className="description-cell">
        <div className="description-text">
          {job?.description || job?.descriptionShort}
        </div>
      </td>
      <td className="date-cell">
        {job.postedDateDisplay}
      </td>
      <td className="action-cell">
        {job.linkHref ? (
          <a 
            href={job.linkHref} 
            target="_blank" 
            rel="noopener noreferrer"
            className="apply-button"
          >
            Apply
          </a>
        ) : (
          <span className="no-link">No link available</span>
        )}
      </td>
    </tr>
  );
});

const SearchJobGoogle = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [groups, setGroups] = useState([]); // [{ id, jobTitle, location, createdAt, jobs: [] }]
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [paginationMap, setPaginationMap] = useState({}); // { [groupId]: currentPage }

  const JOBS_PER_PAGE = 10;

  const groupRefs = useRef({});

  const scrollGroupIntoView = (groupId) => {
    try {
      const node = groupRefs.current?.[groupId];
      if (node && typeof node.scrollIntoView === 'function') {
        node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch {}
  };

  const loadSavedPagination = (groupList) => {
    try {
      const raw = localStorage.getItem('searchJobPagination');
      const saved = raw ? JSON.parse(raw) : {};
      const reconciled = {};
      const list = Array.isArray(groupList) ? groupList : [];
      for (const g of list) {
        const totalPages = Math.max(1, Math.ceil((g?.jobs?.length || 0) / JOBS_PER_PAGE));
        const savedPage = typeof saved[g.id] === 'number' ? saved[g.id] : 1;
        reconciled[g.id] = Math.min(Math.max(1, savedPage), totalPages);
      }
      setPaginationMap(reconciled);
    } catch {
      setPaginationMap({});
    }
  };

  const persistPagination = (map) => {
    try {
      localStorage.setItem('searchJobPagination', JSON.stringify(map));
    } catch {}
  };

  useEffect(() => {
    try {
      const savedGroupsRaw = localStorage.getItem('searchJobGroups');
      if (savedGroupsRaw) {
        const parsedGroups = JSON.parse(savedGroupsRaw);
        if (Array.isArray(parsedGroups)) {
          // Ensure each group's jobs are sorted desc
          const normalized = parsedGroups.map((g) => ({
            ...g,
            jobs: normalizeJobs(g?.jobs),
          }));
          setGroups(normalized);
          setHasSearched(normalized.length > 0);
          loadSavedPagination(normalized);
          return;
        }
      }
      // Legacy migration from 'searchJobs' (flat array)
      const legacyRaw = localStorage.getItem('searchJobs');
      if (legacyRaw) {
        const legacyJobs = JSON.parse(legacyRaw);
        if (Array.isArray(legacyJobs)) {
          const sorted = normalizeJobs(legacyJobs);
          const migrated = [{
            id: Date.now(),
            jobTitle: 'Previous results',
            location: '—',
            createdAt: new Date().toISOString(),
            jobs: sorted,
          }];
          setGroups(migrated);
          setHasSearched(true);
          try {
            localStorage.setItem('searchJobGroups', JSON.stringify(migrated));
            localStorage.removeItem('searchJobs');
          } catch {}
          loadSavedPagination(migrated);
        }
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  const handleSearch = useCallback(async () => {
    if (!jobTitle.trim() || !location.trim()) {
      setError('Please fill in both Job Title and Location fields');
      return;
    }

    setIsSearching(true);
    setError('');
    setHasSearched(true);

    try {
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(`http://localhost:8082/searchJob?jobTitle=${encodeURIComponent(jobTitle.trim())}&location=${encodeURIComponent(location.trim())}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        // Try to get error message from response body
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // If we can't parse the error response, use the status message
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const jobsArray = data?.jobs || data || [];
      // Create new group for this query
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
      // Remove any existing group with same title+location (case-insensitive), then prepend new group
      const updatedGroups = [
        newGroup,
        ...groups.filter(g =>
          (g?.jobTitle || '').trim().toLowerCase() !== normalizedTitle.toLowerCase() ||
          (g?.location || '').trim().toLowerCase() !== normalizedLocation.toLowerCase()
        ),
      ];
      setGroups(updatedGroups);
      try {
        localStorage.setItem('searchJobGroups', JSON.stringify(updatedGroups));
      } catch {
        // ignore storage failures
      }
      // Reset pagination for new group to page 1
      const nextPagination = { ...paginationMap, [newGroup.id]: 1 };
      setPaginationMap(nextPagination);
      persistPagination(nextPagination);
      
    } catch (err) {
      console.error('Search error:', err);
      
      // Handle different types of errors with specific messages
      if (err.name === 'AbortError') {
        setError('Request timed out. The server is taking too long to respond. Please try again.');
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to the server. Try again later.');
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
  }, [jobTitle, location, groups]);

  const handleChangePage = useCallback((groupId, direction) => {
    setPaginationMap((prev) => {
      const current = typeof prev[groupId] === 'number' ? prev[groupId] : 1;
      const group = groups.find((g) => g.id === groupId);
      const totalPages = Math.max(1, Math.ceil(((group?.jobs?.length) || 0) / JOBS_PER_PAGE));
      let next = current;
      if (direction === 'next') {
        next = Math.min(current + 1, totalPages);
      } else if (direction === 'prev') {
        next = Math.max(current - 1, 1);
      } else if (direction === 'first') {
        next = 1;
      } else if (direction === 'last') {
        next = totalPages;
      }
      const updated = { ...prev, [groupId]: next };
      persistPagination(updated);
      return updated;
    });
    // Smooth scroll the group's block into view on page change
    requestAnimationFrame(() => scrollGroupIntoView(groupId));
  }, [groups]);

  const handleClearGroup = useCallback((groupId) => {
    setGroups((prev) => {
      const filtered = prev.filter((g) => g.id !== groupId);
      try {
        localStorage.setItem('searchJobGroups', JSON.stringify(filtered));
      } catch {}
      return filtered;
    });
    setPaginationMap((prev) => {
      const { [groupId]: _removed, ...rest } = prev || {};
      persistPagination(rest);
      return rest;
    });
  }, []);

  const handleClear = useCallback(() => {
    setGroups([]);
    try {
      localStorage.removeItem('searchJobGroups');
    } catch {
      // ignore
    }
    setPaginationMap({});
    try {
      localStorage.removeItem('searchJobPagination');
    } catch {}
  }, []);

  return (
    <div className="search-job-container">
      <div className="back-button-container">
        <button 
          onClick={() => navigate('/')} 
          className="back-button"
        >
          ← Back to Home
        </button>
      </div>
      
      <div className={`search-form ${hasSearched ? 'search-form-searched' : ''}`}>
        <div className="search-inputs">
          <div className="input-group">
            <label htmlFor="jobTitle">Job Title</label>
            <input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Software Engineer, Data Analyst"
              className="search-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York, Remote"
              className="search-input"
            />
          </div>
        </div>
        <button 
          onClick={handleSearch} 
          disabled={isSearching}
          className="search-button"
        >
          {isSearching ? (
            <span className="loading-spinner">
              <div className="spinner"></div>
              Searching...
            </span>
          ) : (
            'Search Jobs'
          )}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {isSearching && (
        <div className="loading-container">
          <div className="loading-spinner-large">
            <div className="spinner-large"></div>
            <p>Searching for jobs...</p>
          </div>
        </div>
      )}

      {!isSearching && groups.length > 0 && (
        <div className="results-container">
          <div className="results-header">
            <h2 className="results-title">Search Results</h2>
          </div>
          {groups.map((group) => {
            const currentPage = typeof paginationMap[group.id] === 'number' ? paginationMap[group.id] : 1;
            const totalPages = Math.max(1, Math.ceil((group.jobs.length || 0) / JOBS_PER_PAGE));
            const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
            const endIndex = startIndex + JOBS_PER_PAGE;
            const paginatedJobs = group.jobs.slice(startIndex, endIndex);
            return (
              <div
                key={group.id}
                className="group-block"
                ref={(el) => {
                  if (el) {
                    groupRefs.current[group.id] = el;
                  }
                }}
              >
                <div className="results-header group-header">
                  <h3 className="group-subtitle">
                    {group.jobs.length} job{group.jobs.length !== 1 ? 's' : ''} matched for {group.jobTitle} in {group.location}
                  </h3>
                  <button
                    className="clear-button"
                    onClick={() => handleClearGroup(group.id)}
                  >
                    Clear
                  </button>
                </div>
                <div className="jobs-table-container">
                  <table className="jobs-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Posted Date</th>
                        <th>Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedJobs.map((job, index) => (
                        <JobRow key={job.linkHref || index} job={job} />
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pagination-controls">
                  <button
                    className="pager-button"
                    onClick={() => handleChangePage(group.id, 'first')}
                    disabled={currentPage <= 1}
                  >
                    «
                  </button>
                  <button
                    className="pager-button"
                    onClick={() => handleChangePage(group.id, 'prev')}
                    disabled={currentPage <= 1}
                  >
                    {'<'}
                  </button>
                  <span className="page-indicator">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="pager-button"
                    onClick={() => handleChangePage(group.id, 'next')}
                    disabled={currentPage >= totalPages}
                  >
                    {'>'}
                  </button>
                  <button
                    className="pager-button"
                    onClick={() => handleChangePage(group.id, 'last')}
                    disabled={currentPage >= totalPages}
                  >
                    »
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isSearching && hasSearched && groups.length === 0 && !error && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No jobs found</h3>
          <p>Try adjusting your search criteria or check back later for new opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default SearchJobGoogle;
