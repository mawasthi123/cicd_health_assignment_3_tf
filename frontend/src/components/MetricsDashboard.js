import React, { useEffect, useState } from 'react';
import { fetchMetrics } from '../api';

function MetricsDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics()
      .then(res => {
        setMetrics(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load metrics');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading metrics...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
      <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
        <h3>Success Rate</h3>
        <p>{metrics.success_rate}%</p>
      </div>
      <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
        <h3>Failure Rate</h3>
        <p>{metrics.failure_rate}%</p>
      </div>
      <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
        <h3>Avg Build Time</h3>
        <p>{metrics.avg_build_time} sec</p>
      </div>
      <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
        <h3>Last Build Status</h3>
        <p>{metrics.last_build_status}</p>
      </div>
    </div>
  );
}

export default MetricsDashboard;