import React, { memo, useCallback } from 'react';
import { useJobGroups } from '../../hooks/useJobGroups';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const ResultsHeader = memo(({ group, isGroupHeader = false }) => {
  const { handleClearGroup } = useJobGroups();
  const { persistPagination } = useLocalStorage();
  
  const onClearGroup = useCallback(() => {
    if (group?.id) {
      handleClearGroup(group.id, persistPagination);
    }
  }, [handleClearGroup, group?.id, persistPagination]);

  if (isGroupHeader) {
    return (
      <div className="results-header group-header">
        <h3 className="group-subtitle">
          {group.jobs.length} job{group.jobs.length !== 1 ? 's' : ''} matched for {group.jobTitle} in {group.location}
        </h3>
        <button
          className="clear-button"
          onClick={onClearGroup}
        >
          Clear
        </button>
      </div>
    );
  }

  return (
    <div className="results-header">
      <h2 className="results-title">Search Results</h2>
    </div>
  );
});

ResultsHeader.displayName = 'ResultsHeader';

export default ResultsHeader;
