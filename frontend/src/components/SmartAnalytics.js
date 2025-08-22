import React, { useState, useEffect } from 'react';

function SmartAnalytics({ isDarkMode = false }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('success-rate');

  // Theme-aware styles
  const themeStyles = {
    background: isDarkMode ? '#1e293b' : '#f8fafc',
    cardBg: isDarkMode ? '#334155' : 'white',
    border: isDarkMode ? '#475569' : '#e5e7eb',
    text: isDarkMode ? '#f1f5f9' : '#1f2937',
    textSecondary: isDarkMode ? '#94a3b8' : '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  };

  useEffect(() => {
    // Generate mock analytics data
    const generateAnalyticsData = () => {
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });

      const successRates = Array.from({ length: 30 }, () => 75 + Math.random() * 25);
      const buildTimes = Array.from({ length: 30 }, () => 5 + Math.random() * 20);
      const buildCounts = Array.from({ length: 30 }, () => 5 + Math.floor(Math.random() * 15));

      return {
        labels: last30Days,
        successRates,
        buildTimes,
        buildCounts,
        insights: {
          trend: successRates[29] > successRates[0] ? 'improving' : 'declining',
          avgSuccessRate: (successRates.reduce((a, b) => a + b, 0) / 30).toFixed(1),
          avgBuildTime: (buildTimes.reduce((a, b) => a + b, 0) / 30).toFixed(1),
          totalBuilds: buildCounts.reduce((a, b) => a + b, 0),
          bestDay: last30Days[successRates.indexOf(Math.max(...successRates))],
          worstDay: last30Days[successRates.indexOf(Math.min(...successRates))]
        }
      };
    };

    setAnalyticsData(generateAnalyticsData());
    setLoading(false);
  }, []);

  const renderSparkline = (data, color, height = 40) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height={height} style={{ overflow: 'visible' }}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
        />
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((value - min) / range) * 100;
          return (
            <circle
              key={index}
              cx={`${x}%`}
              cy={`${y}%`}
              r="2"
              fill={color}
              opacity="0.8"
            />
          );
        })}
      </svg>
    );
  };

  const renderProgressBar = (percentage, color, label) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <span style={{
          fontSize: '14px',
          color: themeStyles.textSecondary,
          fontWeight: '500'
        }}>
          {label}
        </span>
        <span style={{
          fontSize: '14px',
          color: themeStyles.text,
          fontWeight: '600'
        }}>
          {percentage}%
        </span>
      </div>
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: themeStyles.background,
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: '4px',
          transition: 'width 1s ease-in-out'
        }} />
      </div>
    </div>
  );

  const getRecommendations = () => {
    if (!analyticsData) return [];
    
    const { insights } = analyticsData;
    const recommendations = [];

    if (insights.avgSuccessRate < 80) {
      recommendations.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Success Rate Below Target',
        description: `Current average: ${insights.avgSuccessRate}%. Target: 80%+`,
        action: 'Review recent failures and optimize pipeline configuration'
      });
    }

    if (insights.avgBuildTime > 15) {
      recommendations.push({
        type: 'info',
        icon: '⏱️',
        title: 'Build Times Optimization',
        description: `Average build time: ${insights.avgBuildTime} minutes`,
        action: 'Consider parallel jobs, caching, and resource optimization'
      });
    }

    if (insights.trend === 'declining') {
      recommendations.push({
        type: 'error',
        icon: '📉',
        title: 'Declining Performance Trend',
        description: 'Success rate trending downward over the last 30 days',
        action: 'Investigate recent changes and implement monitoring alerts'
      });
    }

    if (insights.totalBuilds < 100) {
      recommendations.push({
        type: 'info',
        icon: '🚀',
        title: 'Increase Build Frequency',
        description: `Only ${insights.totalBuilds} builds in 30 days`,
        action: 'Consider implementing more frequent deployments and testing'
      });
    }

    return recommendations;
  };

  if (loading) {
    return (
      <div style={{
        background: themeStyles.cardBg,
        padding: '40px',
        borderRadius: '12px',
        textAlign: 'center',
        color: themeStyles.textSecondary
      }}>
        📊 Loading analytics...
      </div>
    );
  }

  return (
    <div style={{
      background: themeStyles.cardBg,
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: `1px solid ${themeStyles.border}`,
      marginBottom: '24px'
    }}>
      <h2 style={{ 
        marginBottom: '24px', 
        color: themeStyles.text, 
        fontSize: '20px', 
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🧠 Smart Analytics & Intelligence
      </h2>

      {/* Key Metrics Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: themeStyles.background,
          padding: '20px',
          borderRadius: '12px',
          border: `1px solid ${themeStyles.border}`,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📈</div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: themeStyles.text,
            marginBottom: '4px'
          }}>
            {analyticsData.insights.avgSuccessRate}%
          </div>
          <div style={{
            fontSize: '14px',
            color: themeStyles.textSecondary
          }}>
            Success Rate (30d)
          </div>
          <div style={{ marginTop: '12px' }}>
            {renderSparkline(analyticsData.successRates, themeStyles.success)}
          </div>
        </div>

        <div style={{
          background: themeStyles.background,
          padding: '20px',
          borderRadius: '12px',
          border: `1px solid ${themeStyles.border}`,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏱️</div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: themeStyles.text,
            marginBottom: '4px'
          }}>
            {analyticsData.insights.avgBuildTime}m
          </div>
          <div style={{
            fontSize: '14px',
            color: themeStyles.textSecondary
          }}>
            Avg Build Time
          </div>
          <div style={{ marginTop: '12px' }}>
            {renderSparkline(analyticsData.buildTimes, themeStyles.info)}
          </div>
        </div>

        <div style={{
          background: themeStyles.background,
          padding: '20px',
          borderRadius: '12px',
          border: `1px solid ${themeStyles.border}`,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚀</div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: themeStyles.text,
            marginBottom: '4px'
          }}>
            {analyticsData.insights.totalBuilds}
          </div>
          <div style={{
            fontSize: '14px',
            color: themeStyles.textSecondary
          }}>
            Total Builds (30d)
          </div>
          <div style={{ marginTop: '12px' }}>
            {renderSparkline(analyticsData.buildCounts, themeStyles.warning)}
          </div>
        </div>

        <div style={{
          background: themeStyles.background,
          padding: '20px',
          borderRadius: '12px',
          border: `1px solid ${themeStyles.border}`,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>
            {analyticsData.insights.trend === 'improving' ? '📈' : '📉'}
          </div>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: analyticsData.insights.trend === 'improving' ? themeStyles.success : themeStyles.error,
            marginBottom: '4px',
            textTransform: 'capitalize'
          }}>
            {analyticsData.insights.trend}
          </div>
          <div style={{
            fontSize: '14px',
            color: themeStyles.textSecondary
          }}>
            Performance Trend
          </div>
          <div style={{
            marginTop: '12px',
            fontSize: '12px',
            color: themeStyles.textSecondary
          }}>
            Best: {analyticsData.insights.bestDay}
          </div>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: themeStyles.background,
          padding: '20px',
          borderRadius: '12px',
          border: `1px solid ${themeStyles.border}`
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            color: themeStyles.text,
            fontSize: '16px',
            fontWeight: '600'
          }}>
            📊 Success Rate Breakdown
          </h3>
          {renderProgressBar(analyticsData.insights.avgSuccessRate, themeStyles.success, 'Overall Success Rate')}
          {renderProgressBar(85, themeStyles.info, 'Target Success Rate')}
          {renderProgressBar(95, themeStyles.success, 'Best Day Performance')}
        </div>

        <div style={{
          background: themeStyles.background,
          padding: '20px',
          borderRadius: '12px',
          border: `1px solid ${themeStyles.border}`
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            color: themeStyles.text,
            fontSize: '16px',
            fontWeight: '600'
          }}>
            🎯 Performance Insights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0'
            }}>
              <span style={{ color: themeStyles.textSecondary }}>Best Day:</span>
              <span style={{ color: themeStyles.text, fontWeight: '500' }}>
                {analyticsData.insights.bestDay}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0'
            }}>
              <span style={{ color: themeStyles.textSecondary }}>Worst Day:</span>
              <span style={{ color: themeStyles.text, fontWeight: '500' }}>
                {analyticsData.insights.worstDay}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0'
            }}>
              <span style={{ color: themeStyles.textSecondary }}>Build Frequency:</span>
              <span style={{ color: themeStyles.text, fontWeight: '500' }}>
                {(analyticsData.insights.totalBuilds / 30).toFixed(1)}/day
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div style={{
        background: themeStyles.background,
        padding: '24px',
        borderRadius: '12px',
        border: `1px solid ${themeStyles.border}`
      }}>
        <h3 style={{
          margin: '0 0 20px 0',
          color: themeStyles.text,
          fontSize: '18px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🤖 AI-Powered Recommendations
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {getRecommendations().map((rec, index) => (
            <div key={index} style={{
              background: themeStyles.cardBg,
              padding: '16px',
              borderRadius: '8px',
              border: `1px solid ${themeStyles.border}`,
              borderLeft: `4px solid ${
                rec.type === 'error' ? themeStyles.error :
                rec.type === 'warning' ? themeStyles.warning :
                themeStyles.info
              }`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '20px' }}>{rec.icon}</span>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: themeStyles.text
                }}>
                  {rec.title}
                </div>
              </div>
              
              <div style={{
                fontSize: '14px',
                color: themeStyles.textSecondary,
                marginBottom: '12px',
                lineHeight: '1.5'
              }}>
                {rec.description}
              </div>
              
              <div style={{
                fontSize: '13px',
                color: themeStyles.text,
                fontWeight: '500',
                padding: '8px 12px',
                backgroundColor: themeStyles.background,
                borderRadius: '6px',
                border: `1px solid ${themeStyles.border}`
              }}>
                💡 {rec.action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SmartAnalytics; 