import { useCallback, useRef } from 'react';
import { useSearchJobContext } from '../contexts/SearchJobContext';

export const useJobGroups = () => {
  const { groups, setGroups, setPaginationMap } = useSearchJobContext();
  const debounceTimeout = useRef(null);

  const handleClearGroup = useCallback((groupId, persistPagination) => {
    setGroups((prev) => {
      const filtered = prev.filter((g) => g.id !== groupId);
      
      // Debounce localStorage writes
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      
      debounceTimeout.current = setTimeout(() => {
        try {
          localStorage.setItem('searchJobGroups', JSON.stringify(filtered));
        } catch {}
      }, 100);
      
      return filtered;
    });

    setPaginationMap((prev) => {
      const { [groupId]: _removed, ...rest } = prev || {};
      persistPagination(rest);
      return rest;
    });
  }, [setGroups, setPaginationMap]);

  const handleClear = useCallback(() => {
    setGroups([]);
    setPaginationMap({});
    
    // Debounce localStorage cleanup
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(() => {
      try {
        localStorage.removeItem('searchJobGroups');
        localStorage.removeItem('searchJobPagination');
      } catch {
        // ignore
      }
    }, 100);
  }, [setGroups, setPaginationMap]);

  return {
    handleClearGroup,
    handleClear,
  };
};
