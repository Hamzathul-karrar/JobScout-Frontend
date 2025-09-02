import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchJobGoogle.css';

const SearchJobGoogle = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

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
      const sortedByDateDesc = [...jobsArray].sort((a, b) => {
        return toTimestamp(b?.postedDate) - toTimestamp(a?.postedDate);
      });
      setJobs(sortedByDateDesc);
      
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

      {!isSearching && jobs.length > 0 && (
        <div className="results-container">
          <h2 className="results-title">
             {jobs.length} job{jobs.length !== 1 ? 's' : ''} Matched
          </h2>
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
                 {jobs.map((job, index) => (
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
      )}

      {!isSearching && hasSearched && jobs.length === 0 && !error && (
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
