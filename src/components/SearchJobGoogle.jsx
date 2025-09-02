import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchJobGoogle.css';

const SearchJobGoogle = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [groups, setGroups] = useState([]); // [{ id, jobTitle, location, createdAt, jobs: [] }]
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const toTimestamp = (value) => {
      const d = new Date(value);
      return isNaN(d) ? 0 : d.getTime();
    };
    try {
      const savedGroupsRaw = localStorage.getItem('searchJobGroups');
      if (savedGroupsRaw) {
        const parsedGroups = JSON.parse(savedGroupsRaw);
        if (Array.isArray(parsedGroups)) {
          // Ensure each group's jobs are sorted desc
          const normalized = parsedGroups.map((g) => ({
            ...g,
            jobs: Array.isArray(g?.jobs)
              ? [...g.jobs].sort((a, b) => toTimestamp(b?.postedDate) - toTimestamp(a?.postedDate))
              : [],
          }));
          setGroups(normalized);
          setHasSearched(normalized.length > 0);
          return;
        }
      }
      // Legacy migration from 'searchJobs' (flat array)
      const legacyRaw = localStorage.getItem('searchJobs');
      if (legacyRaw) {
        const legacyJobs = JSON.parse(legacyRaw);
        if (Array.isArray(legacyJobs)) {
          const sorted = [...legacyJobs].sort((a, b) => toTimestamp(b?.postedDate) - toTimestamp(a?.postedDate));
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
        }
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  const handleSearch = async () => {
    if (!jobTitle.trim() || !location.trim()) {
      setError('Please fill in both Job Title and Location fields');
      return;
    }

    setIsSearching(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await fetch(`http://localhost:8082/searchJob?jobTitle=${encodeURIComponent(jobTitle.trim())}&location=${encodeURIComponent(location.trim())}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const jobsArray = data?.jobs || data || [];
      const toTimestamp = (value) => {
        const d = new Date(value);
        return isNaN(d) ? 0 : d.getTime();
      };
      // Create new group for this query
      const normalizedTitle = jobTitle.trim();
      const normalizedLocation = location.trim();
      const sortedJobs = [...jobsArray].sort((a, b) => toTimestamp(b?.postedDate) - toTimestamp(a?.postedDate));
      const newGroup = {
        id: Date.now(),
        jobTitle: normalizedTitle,
        location: normalizedLocation,
        createdAt: new Date().toISOString(),
        jobs: sortedJobs,
      };
      // Prepend to existing groups
      const updatedGroups = [newGroup, ...groups];
      setGroups(updatedGroups);
      try {
        localStorage.setItem('searchJobGroups', JSON.stringify(updatedGroups));
      } catch {
        // ignore storage failures
      }
      
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch jobs. Please check your connection and try again.');
      setJobs([]);
    } finally {
      setIsSearching(false);
    }
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
            <button
              className="clear-button"
              onClick={() => {
                setGroups([]);
                try {
                  localStorage.removeItem('searchJobGroups');
                } catch {
                  // ignore
                }
              }}
            >
              Clear
            </button>
          </div>
          {groups.map((group) => (
            <div key={group.id} style={{ marginBottom: '28px' }}>
              <div className="results-header" style={{ marginBottom: '12px' }}>
                <h3 className="results-title" style={{ margin: 0, fontSize: '1.4rem' }}>
                  {group.jobs.length} job{group.jobs.length !== 1 ? 's' : ''} matched for {group.jobTitle} in {group.location}
                </h3>
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
                    {group.jobs.map((job, index) => (
                      <tr key={index} className="job-row">
                        <td className="company-cell">
                          <strong>{job.company || 'N/A'}</strong>
                        </td>
                        <td className="title-cell">
                          <strong>{job.title || 'N/A'}</strong>
                        </td>
                        <td className="description-cell">
                          {truncateText(job.description || 'No description available')}
                        </td>
                        <td className="date-cell">
                          {formatDate(job.postedDate)}
                        </td>
                        <td className="action-cell">
                          {job.link ? (
                            <a 
                              href={job.link} 
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
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
