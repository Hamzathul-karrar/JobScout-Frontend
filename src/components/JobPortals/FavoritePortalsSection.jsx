import React, { memo } from "react";

import { useJobPortals } from "../../contexts/JobPortalsContext";
import PortalCard from "./PortalCard";

const FavoritePortalsSection = memo(() => {
  const { favoritePortals, getFavoritePortals } = useJobPortals();

  const favoritePortalsList = getFavoritePortals();

  return (
    <div className="portals-section">
      <div className="section-header">
        <h2 className="section-title">Favorite Portals</h2>
      </div>
      <div className="portals-grid">
        {favoritePortals.length === 0 ? (
          <p className="no-favorites">No favorite portals yet.</p>
        ) : (
          favoritePortalsList.map((portal) => (
            <PortalCard
              key={portal.id}
              portal={portal}
              isFavoriteSection={true}
            />
          ))
        )}
      </div>
    </div>
  );
});

FavoritePortalsSection.displayName = "FavoritePortalsSection";

export default FavoritePortalsSection;
