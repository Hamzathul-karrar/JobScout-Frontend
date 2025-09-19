import { useCallback } from 'react';
import { useSearchJobContext } from '../contexts/SearchJobContext';
import { JOBS_PER_PAGE } from '../utils/constants';

export const usePagination = () => {
  const { groups, paginationMap, setPaginationMap, groupRefs } = useSearchJobContext();

  const scrollGroupIntoView = useCallback((groupId) => {
    try {
      const node = groupRefs.current?.[groupId];
      if (node && typeof node.scrollIntoView === 'function') {
        node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch {}
  }, [groupRefs]);

  const handleChangePage = useCallback((groupId, direction) => {
    setPaginationMap((prev) => {
      const current = typeof prev[groupId] === 'number' ? prev[groupId] : 1;
      const group = groups.find((g) => g.id === groupId);
      const totalPages = Math.max(1, Math.ceil(((group?.jobs?.length) || 0) / JOBS_PER_PAGE));
      
      let next = current;
      if (direction === 'next') {
        next = Math.min(current + 1, totalPages);
      } else if (direction === 'prev') {
        next = Math.max(current - 1, 1);
      } else if (direction === 'first') {
        next = 1;
      } else if (direction === 'last') {
        next = totalPages;
      }

      const updated = { ...prev, [groupId]: next };
      // Note: persistPagination will be called from the component
      return updated;
    });

    requestAnimationFrame(() => scrollGroupIntoView(groupId));
  }, [groups, setPaginationMap, scrollGroupIntoView]);

  return {
    handleChangePage,
    scrollGroupIntoView,
  };
};
