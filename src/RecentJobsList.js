import React from 'react';
import "./App.css"

function JobList(props) {
  const { jobs } = props;

  const listItemStyle = {
    color: "#43454B",
    border: '1px solid rgba(0, 0, 0, .2) ',
    borderRadius: '0px',
    padding: '5px',
    marginBottom: '10px',
    

  };

  const formatDate = date => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = date => {
    return date.toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const listStyle = {
    listStyle: 'none',
    padding: '0',
  };

  return (
    <div>
      <ul style={listStyle}>
        {jobs.map(job => (
          <li key={job.id} style={listItemStyle}>
            <p style={{fontFamily:"Extrabold"}}>{job.user_name}</p>
            <p style={{fontFamily:"Extrabold"}}>The {job.job_title}</p>
            <p>{`${formatDate(new Date(job.date_created))} at ${formatTime(new Date(job.date_created))}`}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobList;