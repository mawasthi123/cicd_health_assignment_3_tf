import React, { useEffect, useState } from 'react';
import { fetchMetrics } from '../api';

function AlertBanner() {
  const [lastStatus, setLastStatus] = useState(null);

  useEffect(() => {
    fetchMetrics()
      .then(res => setLastStatus(res.data.last_build_status))
      .catch(() => setLastStatus(null));
  }, []);

  if (lastStatus === 'failure') {
    return (
      <div style={{ background: '#ffcccc', color: '#a00', padding: 16, borderRadius: 8, marginBottom: 24 }}>
        <strong>Alert:</strong> The last build failed! Please check the logs and take action.
      </div>
    );
  }
  return null;
}

export default AlertBanner;