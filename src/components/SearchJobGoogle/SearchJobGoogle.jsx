import React, { useEffect, useMemo, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SearchJobProvider, useSearchJobContext } from '../../contexts/SearchJobContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import SearchForm from './SearchForm';
import JobsTable from './JobsTable';
import PaginationControls from './PaginationControls';
import ResultsHeader from './ResultsHeader';
import Navigation from '../Navigation/Navigation';
import { JOBS_PER_PAGE } from '../../utils/constants';
import './SearchJobGoogle.css';

const GroupBlock = memo(({ group, currentPage, groupRefs }) => {
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const paginatedJobs = group.jobs.slice(startIndex, endIndex);
  
  const setRef = useCallback((el) => {
    if (el) {
      groupRefs.current[group.id] = el;
    }
  }, [group.id, groupRefs]);

  return (
    <div key={group.id} className="group-block" ref={setRef}>
      <ResultsHeader group={group} isGroupHeader={true} />
      <JobsTable jobs={paginatedJobs} />
      <PaginationControls group={group} currentPage={currentPage} />
    </div>
  );
});

GroupBlock.displayName = 'GroupBlock';

const LoadingSpinner = memo(() => (
  <div className="loading-container">
    <div className="loading-spinner">
      <span className="spinner" />
      <p>Loading...</p>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

const SearchingSpinner = memo(() => (
  <div className="loading-container">
    <div className="loading-spinner-large">
      <div className="spinner-large"></div>
      <p>Searching for jobs...</p>
    </div>
  </div>
));

SearchingSpinner.displayName = 'SearchingSpinner';

const NoResults = memo(() => (
  <div className="no-results">
    <div className="no-results-icon">🔍</div>
    <h3>No jobs found</h3>
    <p>Try adjusting your search criteria or check back later for new opportunities.</p>
  </div>
));

NoResults.displayName = 'NoResults';

const ErrorMessage = memo(({ error }) => (
  <div className="error-message">
    <span className="error-icon">⚠️</span>
    {error}
  </div>
));

ErrorMessage.displayName = 'ErrorMessage';

const SearchJobGoogleContent = memo(() => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { 
    isSearching, 
    groups, 
    error, 
    hasSearched, 
    paginationMap, 
    groupRefs 
  } = useSearchJobContext();
  
  const { loadInitialData } = useLocalStorage();

  const onBackClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const groupBlocks = useMemo(() => {
    return groups.map((group) => {
      const currentPage = typeof paginationMap[group.id] === 'number' ? paginationMap[group.id] : 1;
      return (
        <GroupBlock 
          key={group.id}
          group={group} 
          currentPage={currentPage} 
          groupRefs={groupRefs}
        />
      );
    });
  }, [groups, paginationMap, groupRefs]);

  if (isLoading) {
    return (
      <div className="search-job-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="search-job-container">
      
      <Navigation />
      <SearchForm />
      
      {error && <ErrorMessage error={error} />}
      
      {isSearching && <SearchingSpinner />}
      
      {!isSearching && groups.length > 0 && (
        <div className="results-container">
          <ResultsHeader />
          {groupBlocks}
        </div>
      )}
      
      {!isSearching && hasSearched && groups.length === 0 && !error && <NoResults />}
    </div>
  );
});

SearchJobGoogleContent.displayName = 'SearchJobGoogleContent';

const SearchJobGoogle = () => {
  return (
    <SearchJobProvider>
      <SearchJobGoogleContent />
    </SearchJobProvider>
  );
};

export default SearchJobGoogle;
