import { useCallback, useRef } from 'react';
import { useSearchJobContext } from '../contexts/SearchJobContext';
import { normalizeJobs } from '../utils/jobUtils';
import { JOBS_PER_PAGE } from '../utils/constants';

export const useLocalStorage = () => {
  const { setGroups, setHasSearched, setPaginationMap } = useSearchJobContext();
  const debounceTimeout = useRef(null);

  const loadSavedPagination = useCallback((groupList) => {
    try {
      const raw = localStorage.getItem('searchJobPagination');
      const saved = raw ? JSON.parse(raw) : {};
      const reconciled = {};
      const list = Array.isArray(groupList) ? groupList : [];
      
      for (const g of list) {
        const totalPages = Math.max(1, Math.ceil((g?.jobs?.length || 0) / JOBS_PER_PAGE));
        const savedPage = typeof saved[g.id] === 'number' ? saved[g.id] : 1;
        reconciled[g.id] = Math.min(Math.max(1, savedPage), totalPages);
      }
      
      setPaginationMap(reconciled);
    } catch {
      setPaginationMap({});
    }
  }, [setPaginationMap]);

  const persistPagination = useCallback((map) => {
    // Debounce localStorage writes
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(() => {
      try {
        localStorage.setItem('searchJobPagination', JSON.stringify(map));
      } catch {
        // ignore storage errors
      }
    }, 100);
  }, []);

  const loadInitialData = useCallback(() => {
    try {
      const savedGroupsRaw = localStorage.getItem('searchJobGroups');
      if (savedGroupsRaw) {
        const parsedGroups = JSON.parse(savedGroupsRaw);
        if (Array.isArray(parsedGroups)) {
          // FIXED: Normalize jobs but avoid double processing
          const normalized = parsedGroups.map((g) => ({
            ...g,
            jobs: normalizeJobs(g?.jobs),
          }));
          setGroups(normalized);
          setHasSearched(normalized.length > 0);
          loadSavedPagination(normalized);
          return;
        }
      }
      
      const legacyRaw = localStorage.getItem('searchJobs');
      if (legacyRaw) {
        const legacyJobs = JSON.parse(legacyRaw);
        if (Array.isArray(legacyJobs)) {
          const sorted = normalizeJobs(legacyJobs);
          const migrated = [{
            id: Date.now(),
            jobTitle: 'Previous results',
            location: '—',
            createdAt: new Date().toISOString(),
            jobs: sorted,
          }];
          setGroups(migrated);
          setHasSearched(true);
          try {
            localStorage.setItem('searchJobGroups', JSON.stringify(migrated));
            localStorage.removeItem('searchJobs');
          } catch {}
          loadSavedPagination(migrated);
        }
      }
    } catch {
      // ignore corrupted storage
    }
  }, [setGroups, setHasSearched, loadSavedPagination]);

  return {
    loadSavedPagination,
    persistPagination,
    loadInitialData,
  };
};
