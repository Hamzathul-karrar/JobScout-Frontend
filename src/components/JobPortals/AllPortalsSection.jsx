import React, { memo, useMemo } from "react";

import { useJobPortals } from "../../contexts/JobPortalsContext";
import PortalCard from "./PortalCard";

const AllPortalsSection = memo(() => {
  const { jobPortals } = useJobPortals();

  // Memoize the filtered portals to avoid re-filtering on every render
  const validPortals = useMemo(() => {
    return jobPortals.filter((portal) => portal && portal.name && portal.url);
  }, [jobPortals]);

  return (
    <div className="portals-section">
      <div className="section-header">
        <h2 className="section-title">All Job Portals</h2>
        <span className="portals-count">({validPortals.length})</span>
      </div>
      <div className="portals-grid">
        {validPortals.map((portal) => (
          <PortalCard
            key={portal.id}
            portal={portal}
            isFavoriteSection={false}
          />
        ))}
      </div>
    </div>
  );
});

AllPortalsSection.displayName = "AllPortalsSection";

export default AllPortalsSection;
