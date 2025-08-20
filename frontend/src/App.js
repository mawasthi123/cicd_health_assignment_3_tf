import React from 'react';
import MetricsDashboard from './components/MetricsDashboard';
import BuildsTable from './components/BuildsTable';
import AlertBanner from './components/AlertBanner';

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>CI/CD Pipeline Health Dashboard</h1>
      <AlertBanner />
      <MetricsDashboard />
      <BuildsTable />
    </div>
  );
}

export default App;