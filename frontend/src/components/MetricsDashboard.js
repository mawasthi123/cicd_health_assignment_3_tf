import React, { useEffect, useState } from 'react';
import { fetchMetrics } from '../api';

function MetricsDashboard({ isDarkMode = false }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Auto-refresh state
  const [refreshInterval, setRefreshInterval] = useState(15000); // 15s default
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Theme-aware styles
  const themeStyles = {
    background: isDarkMode ? '#1e293b' : '#f8fafc',
    cardBg: isDarkMode ? '#334155' : 'white',
    border: isDarkMode ? '#475569' : '#e5e7eb',
    text: isDarkMode ? '#f1f5f9' : '#1f2937',
    textSecondary: isDarkMode ? '#94a3b8' : '#6b7280'
  };

  const fetchMetricsData = () => {
    fetchMetrics()
      .then(res => {
        setMetrics(res.data);
        setLastUpdated(new Date());
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load metrics');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMetricsData();
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(fetchMetricsData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, isAutoRefresh]);

  const handleRefreshIntervalChange = (newInterval) => {
    setRefreshInterval(newInterval);
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
  };

  const manualRefresh = () => {
    fetchMetricsData();
  };

  if (loading) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      fontSize: '18px', 
      color: '#666' 
    }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid #f3f3f3', 
        borderTop: '4px solid #3498db', 
        borderRadius: '50%', 
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
      }}></div>
      Loading metrics...
    </div>
  );
  
  if (error) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      color: '#e74c3c',
      backgroundColor: '#fdf2f2',
      borderRadius: '8px',
      border: '1px solid #fecaca'
    }}>
      {error}
    </div>
  );

  const getStatusColor = (status) => {
    return status === 'success' ? '#10b981' : '#ef4444';
  };

  const getMetricColor = (value, type) => {
    if (type === 'success_rate') return value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444';
    if (type === 'failure_rate') return value <= 20 ? '#10b981' : value <= 40 ? '#f59e0b' : '#ef4444';
    if (type === 'avg_build_time') return value <= 60 ? '#10b981' : value <= 120 ? '#f59e0b' : '#ef4444';
    return '#6b7280';
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ 
        marginBottom: '24px', 
        color: '#1f2937', 
        fontSize: '24px', 
        fontWeight: '600',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '12px'
      }}>
        📊 Pipeline Metrics Overview
      </h2>
      
      {/* Auto-refresh Controls */}
      <div style={{
        background: themeStyles.cardBg,
        padding: '16px 20px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${themeStyles.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔄</span>
          <span style={{ fontSize: '14px', color: themeStyles.textSecondary, fontWeight: '500' }}>
            Auto-refresh:
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: '5s', value: 5000 },
            { label: '15s', value: 15000 },
            { label: '1m', value: 60000 }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleRefreshIntervalChange(option.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: `1px solid ${refreshInterval === option.value ? '#3b82f6' : themeStyles.border}`,
                backgroundColor: refreshInterval === option.value ? '#3b82f6' : themeStyles.cardBg,
                color: refreshInterval === option.value ? 'white' : themeStyles.textSecondary,
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        <button
          onClick={toggleAutoRefresh}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: `1px solid ${themeStyles.border}`,
            backgroundColor: isAutoRefresh ? '#10b981' : '#ef4444',
            color: 'white',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isAutoRefresh ? '⏸️ Pause' : '▶️ Resume'}
        </button>
        
        <button
          onClick={manualRefresh}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #3b82f6',
            backgroundColor: themeStyles.cardBg,
            color: '#3b82f6',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          🔄 Refresh Now
        </button>
        
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: themeStyles.textSecondary }}>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Success Rate Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: '-20px', 
            right: '-20px', 
            fontSize: '80px', 
            opacity: '0.1' 
          }}>
            ✅
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>
            Success Rate
          </h3>
          <p style={{ 
            margin: '0', 
            fontSize: '32px', 
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {metrics.success_rate}%
          </p>
          <div style={{ 
            marginTop: '12px', 
            fontSize: '14px', 
            opacity: '0.9' 
          }}>
            {metrics.success_rate >= 80 ? 'Excellent' : metrics.success_rate >= 60 ? 'Good' : 'Needs Attention'}
          </div>
        </div>

        {/* Failure Rate Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: '-20px', 
            right: '-20px', 
            fontSize: '80px', 
            opacity: '0.1' 
          }}>
            ❌
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>
            Failure Rate
          </h3>
          <p style={{ 
            margin: '0', 
            fontSize: '32px', 
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {metrics.failure_rate}%
          </p>
          <div style={{ 
            marginTop: '12px', 
            fontSize: '14px', 
            opacity: '0.9' 
          }}>
            {metrics.failure_rate <= 20 ? 'Low Risk' : metrics.failure_rate <= 40 ? 'Moderate' : 'High Risk'}
          </div>
        </div>

        {/* Average Build Time Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: '-20px', 
            right: '-20px', 
            fontSize: '80px', 
            opacity: '0.1' 
          }}>
            ⏱️
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>
            Avg Build Time
          </h3>
          <p style={{ 
            margin: '0', 
            fontSize: '32px', 
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {metrics.avg_build_time}s
          </p>
          <div style={{ 
            marginTop: '12px', 
            fontSize: '14px', 
            opacity: '0.9' 
          }}>
            {metrics.avg_build_time <= 60 ? 'Fast' : metrics.avg_build_time <= 120 ? 'Normal' : 'Slow'}
          </div>
        </div>

        {/* Last Build Status Card */}
        <div style={{ 
          background: `linear-gradient(135deg, ${getStatusColor(metrics.last_build_status)} 0%, ${getStatusColor(metrics.last_build_status)}dd 100%)`,
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: `0 10px 25px ${getStatusColor(metrics.last_build_status)}20`,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: '-20px', 
            right: '-20px', 
            fontSize: '80px', 
            opacity: '0.1' 
          }}>
            {metrics.last_build_status === 'success' ? '🎉' : '⚠️'}
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>
            Last Build Status
          </h3>
          <p style={{ 
            margin: '0', 
            fontSize: '32px', 
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textTransform: 'capitalize'
          }}>
            {metrics.last_build_status}
          </p>
          <div style={{ 
            marginTop: '12px', 
            fontSize: '14px', 
            opacity: '0.9' 
          }}>
            {metrics.last_build_status === 'success' ? 'All Good!' : 'Check Logs'}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ 
        background: `linear-gradient(135deg, ${themeStyles.background} 0%, ${themeStyles.border} 100%)`,
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${themeStyles.border}`
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>📈</span>
            <span style={{ color: themeStyles.textSecondary, fontWeight: '500' }}>
              Overall Health: {metrics.success_rate >= 80 ? '🟢 Excellent' : metrics.success_rate >= 60 ? '🟡 Good' : '🔴 Needs Attention'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🔄</span>
            <span style={{ color: themeStyles.textSecondary, fontWeight: '500' }}>
              Last Updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default MetricsDashboard;