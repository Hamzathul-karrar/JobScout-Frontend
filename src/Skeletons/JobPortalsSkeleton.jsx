
// JobPortalsSkeleton.js
import React from 'react';
import './Skeleton.css';

const JobPortalsSkeleton = () => {
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
        {/* Favorite Portals Section */}
        <div className="skeleton-portals-section">
          <div className="skeleton skeleton-section-title"></div>
          <div className="skeleton-portals-grid">
            <div className="skeleton-portal-card">
              <div className="skeleton skeleton-portal-name"></div>
              <div className="skeleton skeleton-heart"></div>
            </div>
            <div className="skeleton-portal-card">
              <div className="skeleton skeleton-portal-name"></div>
              <div className="skeleton skeleton-heart"></div>
            </div>
          </div>
        </div>

        {/* All Job Portals Section */}
        <div className="skeleton-portals-section">
          <div className="skeleton skeleton-section-title"></div>
          <div className="skeleton-portals-grid">
            <div className="skeleton-portal-card">
              <div className="skeleton skeleton-portal-name"></div>
              <div className="skeleton skeleton-heart"></div>
            </div>
            <div className="skeleton-portal-card">
              <div className="skeleton skeleton-portal-name"></div>
              <div className="skeleton skeleton-heart"></div>
            </div>
            <div className="skeleton-portal-card">
              <div className="skeleton skeleton-portal-name"></div>
              <div className="skeleton skeleton-heart"></div>
            </div>
            <div className="skeleton-portal-card">
              <div className="skeleton skeleton-portal-name"></div>
              <div className="skeleton skeleton-heart"></div>
            </div>
            <div className="skeleton-portal-card">
              <div className="skeleton skeleton-portal-name"></div>
              <div className="skeleton skeleton-heart"></div>
            </div>
            <div className="skeleton-portal-card">
              <div className="skeleton skeleton-portal-name"></div>
              <div className="skeleton skeleton-heart"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPortalsSkeleton;
