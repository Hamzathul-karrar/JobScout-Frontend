import React, { memo, useCallback } from 'react';
import { useSearchJobContext } from '../../contexts/SearchJobContext';
import { useJobSearch } from '../../hooks/useJobSearch';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const SearchForm = memo(() => {
  const { 
    jobTitle, 
    setJobTitle, 
    location, 
    setLocation, 
    isSearching, 
    hasSearched 
  } = useSearchJobContext();
  
  const { handleSearch } = useJobSearch();
  const { persistPagination } = useLocalStorage();

  const onSearch = useCallback(() => {
    handleSearch(persistPagination);
  }, [handleSearch, persistPagination]);

  const onJobTitleChange = useCallback((e) => {
    setJobTitle(e.target.value);
  }, [setJobTitle]);

  const onLocationChange = useCallback((e) => {
    setLocation(e.target.value);
  }, [setLocation]);

  return (
    <div className={`search-form ${hasSearched ? 'search-form-searched' : ''}`}>
      <div className="search-inputs">
        <div className="input-group">
          <label htmlFor="jobTitle">Job Title</label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={onJobTitleChange}
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
            onChange={onLocationChange}
            placeholder="e.g., New York, Remote"
            className="search-input"
          />
        </div>
      </div>
      <button 
        onClick={onSearch} 
        disabled={isSearching}
        className="search-button"
      >
        {isSearching ? (
          <span className="loading-spinner">
            <div className="spinner"></div>
          </span>
        ) : (
          'Search Jobs'
        )}
      </button>
    </div>
  );
});

SearchForm.displayName = 'SearchForm';

export default SearchForm;
