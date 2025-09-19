import React, { memo } from 'react';

const JobRow = memo(({ job }) => {
  return (
    <tr className="job-row">
      <td className="company-cell">
        <strong>{job.companyDisplay}</strong>
      </td>
      <td className="title-cell">
        <strong>{job.titleDisplay}</strong>
      </td>
      <td className="description-cell">
        <div className="description-text">
          {job?.description || job?.descriptionShort}
        </div>
      </td>
      <td className="date-cell">
        {job.postedDateDisplay}
      </td>
      <td className="action-cell">
        {job.linkHref ? (
          <a 
            href={job.linkHref} 
            target="_blank" 
            rel="noopener noreferrer"
            className="apply-button"
          >
            Apply
          </a>
        ) : (
          <span className="no-link">No link available</span>
        )}
      </td>
    </tr>
  );
});

JobRow.displayName = 'JobRow';

export default JobRow;
