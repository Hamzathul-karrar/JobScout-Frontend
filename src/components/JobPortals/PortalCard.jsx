import React, { memo } from "react";
import { useJobPortals } from "../../contexts/JobPortalsContext";

const PortalCard = memo(({ portal, isFavoriteSection = false }) => {
  const { favoritePortals, handleCardClick, handleHeartClick } = useJobPortals();

  return (
    <div
      className={`portal-card ${isFavoriteSection ? "favorite" : ""}`}
      onClick={(e) => handleCardClick(e, portal.url)}
    >
      <div className="portal-info">
        <h3 className="portal-name">{portal.name}</h3>
      </div>
      <button
        className={`heart-btn ${
          favoritePortals.includes(portal.id) ? "favorite" : ""
        }`}
        onClick={(e) => handleHeartClick(e, portal.id)}
        title={
          favoritePortals.includes(portal.id)
            ? "Remove from favorites"
            : "Add to favorites"
        }
        data-action="heart"
      >
        {favoritePortals.includes(portal.id) ? "❤️" : "🤍"}
      </button>
    </div>
  );
});

PortalCard.displayName = "PortalCard";

export default PortalCard;
