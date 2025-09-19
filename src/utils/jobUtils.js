export const toTimestamp = (value) => {
    try {
      if (!value && value !== 0) return 0;
      if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
      if (value instanceof Date) return isNaN(value) ? 0 : value.getTime();
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (/^\d{10,13}$/.test(trimmed)) {
          const num = parseInt(trimmed, 10);
          return trimmed.length === 10 ? num * 1000 : num;
        }
        const d = new Date(trimmed);
        return isNaN(d) ? 0 : d.getTime();
      }
      return 0;
    } catch {
      return 0;
    }
  };
  
  export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };
  
  export const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  
  // Normalize backend jobs once: sort by postedDate desc, assign sequential ids; skip resort on reload
  export const normalizeJobs = (jobs) => {
    const safeJobs = Array.isArray(jobs) ? jobs : [];
  
    // If every job already has a sortTimestamp, assume it's already normalized and in desired order
    const alreadyNormalized = safeJobs.length > 0 && safeJobs.every(j => j && typeof j.sortTimestamp === 'number');
    if (alreadyNormalized) {
      return safeJobs;
    }
  
    const enriched = safeJobs.map((job, originalIndex) => ({
      ...job,
      sortTimestamp: toTimestamp(job?.postedDate),
      originalIndex,
      companyDisplay: job?.company || 'N/A',
      titleDisplay: job?.title || 'N/A',
      descriptionShort: truncateText(job?.description || 'No description available'),
      postedDateDisplay: formatDate(job?.postedDate),
      linkHref: job?.link || '',
    }));
  
    // Sort latest first
    enriched.sort((a, b) => {
      if (a.sortTimestamp !== b.sortTimestamp) {
        return b.sortTimestamp - a.sortTimestamp;
      }
      return (a.originalIndex || 0) - (b.originalIndex || 0);
    });
  
    // Assign sequential ids based on sorted order (0 = most recent)
    return enriched.map((job, idx) => ({
      ...job,
      id: idx,
    }));
  };
  