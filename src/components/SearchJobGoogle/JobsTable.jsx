import React, { memo } from 'react';
import JobRow from './JobRow';

const JobsTable = memo(({ jobs }) => {
  return (
    <div className="jobs-table-container">
      <table className="jobs-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Title</th>
            <th>Description</th>
            <th>Posted Date</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <JobRow key={job.linkHref || `${job.id}-${index}`} job={job} />
          ))}
        </tbody>
      </table>
    </div>
  );
});

JobsTable.displayName = 'JobsTable';

export default JobsTable;
