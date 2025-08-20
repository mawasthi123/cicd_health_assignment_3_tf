import React, { useEffect, useState } from 'react';
import { fetchBuilds, fetchBuildLogs } from '../api';

function BuildsTable() {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logModal, setLogModal] = useState({ open: false, logs: '' });

  useEffect(() => {
    fetchBuilds()
      .then(res => {
        setBuilds(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load builds');
        setLoading(false);
      });
  }, []);

  const handleViewLogs = (id) => {
    fetchBuildLogs(id)
      .then(res => setLogModal({ open: true, logs: res.data.logs }))
      .catch(() => setLogModal({ open: true, logs: 'Failed to load logs' }));
  };

  if (loading) return <div>Loading builds...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Recent Builds</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Duration (sec)</th>
            <th>Started At</th>
            <th>Finished At</th>
            <th>Logs</th>
          </tr>
        </thead>
        <tbody>
          {builds.map(build => (
            <tr key={build.id} style={{ background: build.status === 'failure' ? '#ffeaea' : 'inherit' }}>
              <td>{build.id}</td>
              <td>{build.status}</td>
              <td>{build.duration}</td>
              <td>{build.started_at}</td>
              <td>{build.finished_at}</td>
              <td>
                <button onClick={() => handleViewLogs(build.id)}>View Logs</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {logModal.open && (
        <div style={{ position: 'fixed', top: 80, left: 0, right: 0, background: '#fff', border: '1px solid #ccc', padding: 24, zIndex: 1000 }}>
          <h3>Build Logs</h3>
          <pre style={{ maxHeight: 300, overflow: 'auto' }}>{logModal.logs}</pre>
          <button onClick={() => setLogModal({ open: false, logs: '' })}>Close</button>
        </div>
      )}
    </div>
  );
}

export default BuildsTable;