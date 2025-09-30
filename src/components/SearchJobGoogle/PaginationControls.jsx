import React, { memo, useCallback } from 'react';
import { usePagination } from '../../hooks/usePagination';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { JOBS_PER_PAGE } from '../../utils/constants';

const PaginationControls = memo(({ group, currentPage }) => {
  const { handleChangePage } = usePagination();
  const { persistPagination } = useLocalStorage();
  
  const totalPages = Math.max(1, Math.ceil((group.jobs.length || 0) / JOBS_PER_PAGE));
  
  const onChangePage = useCallback((direction) => {
    handleChangePage(group.id, direction);
  }, [handleChangePage, group.id]);

  const onFirst = useCallback(() => onChangePage('first'), [onChangePage]);
  const onPrev = useCallback(() => onChangePage('prev'), [onChangePage]);
  const onNext = useCallback(() => onChangePage('next'), [onChangePage]);
  const onLast = useCallback(() => onChangePage('last'), [onChangePage]);

  return (
    <div className="pagination-controls">
      <button
        className="pager-button"
        onClick={onFirst}
        disabled={currentPage <= 1}
      >
        «
      </button>
      <button
        className="pager-button"
        onClick={onPrev}
        disabled={currentPage <= 1}
      >
        {'<'}
      </button>
      <span className="page-indicator">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="pager-button"
        onClick={onNext}
        disabled={currentPage >= totalPages}
      >
        {'>'}
      </button>
      <button
        className="pager-button"
        onClick={onLast}
        disabled={currentPage >= totalPages}
      >
        »
      </button>
    </div>
  );
});

PaginationControls.displayName = 'PaginationControls';

export default PaginationControls;
