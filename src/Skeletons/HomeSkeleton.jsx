
// HomeSkeleton.js
import React from 'react';
import './Skeleton.css';

const HomeSkeleton = () => {
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
        {/* Hero Section */}
        <div className="skeleton-hero">
          <div className="skeleton skeleton-hero-badge"></div>
          <div className="skeleton skeleton-hero-title"></div>
          <div className="skeleton skeleton-hero-description"></div>
          <div className="skeleton-hero-buttons">
            <div className="skeleton skeleton-button"></div>
            <div className="skeleton skeleton-button"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;
