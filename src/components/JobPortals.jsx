import React, { useState } from 'react';
import './JobPortals.css';

const JobPortals = ({ onBackToHome }) => {
  const [favoritePortals, setFavoritePortals] = useState([]);
  const [activeTab, setActiveTab] = useState('home');

  const jobPortals = [
    { id: 1, name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/', isFavorite: false },
    { id: 2, name: 'Indeed', url: 'https://www.indeed.com/', isFavorite: false },
    { id: 3, name: 'Glassdoor', url: 'https://www.glassdoor.co.in/Job/', isFavorite: false },
    { id: 4, name: 'Monster', url: 'https://www.monster.com/', isFavorite: false }, //
    { id: 5, name: 'CareerBuilder', url: 'https://www.careerbuilder.com/', isFavorite: false }, //
    { id: 6, name: 'ZipRecruiter', url: 'https://www.ziprecruiter.com/', isFavorite: false },
    { id: 7, name: 'SimplyHired', url: 'https://www.simplyhired.com/', isFavorite: false }, 
    { id: 8, name: 'Dice', url: 'https://www.dice.com/', isFavorite: false }, //
    { id: 9, name: 'AngelList', url: 'https://angel.co/jobs', isFavorite: false },
    { id: 10, name: 'Stack Overflow Jobs', url: 'https://stackoverflow.com/jobs', isFavorite: false }, //
    { id: 11, name: 'Remote.co', url: 'https://remote.co/', isFavorite: false },
    { id: 12, name: 'WeWorkRemotely', url: 'https://weworkremotely.com/', isFavorite: false }
  ];

  const toggleFavorite = (portalId) => {
    setFavoritePortals(prev => {
      const isAlreadyFavorite = prev.includes(portalId);
      if (isAlreadyFavorite) {
        return prev.filter(id => id !== portalId);
      } else {
        return [...prev, portalId];
      }
    });
  };

  const getFavoritePortals = () => {
    // Filter favorite portals and sort by most recently added (reverse order)
    return jobPortals
      .filter(portal => favoritePortals.includes(portal.id))
      .sort((a, b) => {
        const aIndex = favoritePortals.indexOf(a.id);
        const bIndex = favoritePortals.indexOf(b.id);
        // Reverse order so most recently added appears first
        return bIndex - aIndex;
      });
  };

  const handlePortalClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="job-portals">
      {/* Header with JobScout branding and navigation */}
      <header className="portals-header">
        <div className="header-content">
          <div className="brand">
            <h1 className="jobscout-title">JobScout</h1>
          </div>
          <nav className="navigation">
            <button 
              className="nav-btn back-btn"
              onClick={onBackToHome}
              title="Back to Home"
            >
              ← Back to Home
            </button>
            
            <button 
              className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              🔍 Search Jobs
            </button>
          </nav>
        </div>
      </header>

      <div className="portals-container">
        {/* Favorite Portals Section */}
        <section className="favorite-portals">
          <h2 className="section-title">
            Favorite Portals
          </h2>
          {favoritePortals.length === 0 ? (
            <p className="no-favorites">No favorite portals yet.</p>
          ) : (
            <div className="portals-grid">
              {getFavoritePortals().map(portal => (
                <div key={portal.id} className="portal-card favorite">
                  <div className="portal-info" onClick={() => handlePortalClick(portal.url)}>
                    <h3 className="portal-name">{portal.name}</h3>
                  </div>
                  <button 
                    className="heart-btn favorite"
                    onClick={() => toggleFavorite(portal.id)}
                    title="Remove from favorites"
                  >
                    ❤️
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* All Job Portals Section */}
        <section className="all-portals">
          <h2 className="section-title">
            All Job Portals 
            <span className="portal-count">({jobPortals.length})</span>
          </h2>
          <div className="portals-grid">
            {jobPortals.map(portal => (
              <div key={portal.id} className="portal-card">
                <div className="portal-info" onClick={() => handlePortalClick(portal.url)}>
                  <h3 className="portal-name">{portal.name}</h3>
                </div>
                <button 
                  className={`heart-btn ${favoritePortals.includes(portal.id) ? 'favorite' : ''}`}
                  onClick={() => toggleFavorite(portal.id)}
                  title={favoritePortals.includes(portal.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {favoritePortals.includes(portal.id) ? '❤️' : '🤍'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobPortals;
