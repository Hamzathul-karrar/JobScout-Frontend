
// JobSearchSkeleton.js
import React from 'react';
import './Skeleton.css';

const JobSearchSkeleton = () => {
  return (
    <div className="skeleton-container">
      {/* Header */}
      <div className="skeleton-header">
        <div className="skeleton skeleton-logo"></div>
        <div className="skeleton-nav">
          <div className="skeleton skeleton-nav-item"></div>
          <div className="skeleton skeleton-nav-item"></div>
          <div className="skeleton skeleton-nav-item"></div>
          <div className="skeleton skeleton-nav-item"></div>
        </div>
      </div>

      <div className="skeleton-content">
        {/* Search Form */}
        <div className="skeleton-search-container">
          <div className="skeleton-search-form">
            <div className="skeleton skeleton-search-input"></div>
            <div className="skeleton skeleton-search-input"></div>
          </div>
          <div className="skeleton skeleton-search-button"></div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchSkeleton;
