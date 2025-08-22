import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ChartsAndTrends({ isDarkMode = false }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theme-aware styles
  const themeStyles = {
    background: isDarkMode ? '#1e293b' : '#f8fafc',
    cardBg: isDarkMode ? '#334155' : 'white',
    border: isDarkMode ? '#475569' : '#e5e7eb',
    text: isDarkMode ? '#f1f5f9' : '#1f2937',
    textSecondary: isDarkMode ? '#94a3b8' : '#6b7280',
    gridColor: isDarkMode ? '#475569' : '#e5e7eb'
  };

  // Chart.js theme configuration
  const chartTheme = {
    color: themeStyles.text,
    borderColor: themeStyles.border,
    backgroundColor: themeStyles.cardBg,
    gridColor: themeStyles.gridColor
  };

  useEffect(() => {
    // Simulate chart data - in real app, this would come from API
    const generateMockChartData = () => {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });

      const successRates = [85, 92, 78, 88, 95, 87, 91];
      const buildDurations = [12, 8, 15, 10, 7, 13, 9];
      const buildCounts = [8, 12, 6, 10, 15, 9, 11];

      return {
        labels: last7Days,
        successRates,
        buildDurations,
        buildCounts
      };
    };

    setChartData(generateMockChartData());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{
        background: themeStyles.cardBg,
        padding: '40px',
        borderRadius: '12px',
        textAlign: 'center',
        color: themeStyles.textSecondary
      }}>
        📊 Loading charts...
      </div>
    );
  }

  // Success Rate Trend Chart
  const successRateData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Success Rate (%)',
        data: chartData.successRates,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  // Build Duration Trend Chart
  const buildDurationData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Average Build Time (min)',
        data: chartData.buildDurations,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  // Build Frequency Bar Chart
  const buildFrequencyData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Build Count',
        data: chartData.buildCounts,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: '#8b5cf6',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  // Success vs Failure Doughnut Chart
  const successFailureData = {
    labels: ['Success', 'Failure', 'Running'],
    datasets: [
      {
        data: [78, 15, 7],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          '#10b981',
          '#ef4444',
          '#3b82f6'
        ],
        borderWidth: 3,
        hoverOffset: 4
      }
    ]
  };

  // Chart options with theme support
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: chartTheme.color,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: chartTheme.backgroundColor,
        titleColor: chartTheme.color,
        bodyColor: chartTheme.color,
        borderColor: chartTheme.borderColor,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      x: {
        grid: {
          color: chartTheme.gridColor,
          drawBorder: false
        },
        ticks: {
          color: chartTheme.textSecondary,
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: chartTheme.gridColor,
          drawBorder: false
        },
        ticks: {
          color: chartTheme.textSecondary,
          font: {
            size: 11
          }
        }
      }
    }
  };

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
        📈 Pipeline Analytics & Trends
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Success Rate Trend */}
        <div style={{
          background: themeStyles.background,
          padding: '20px',
          borderRadius: '8px',
          border: `1px solid ${themeStyles.border}`
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            color: themeStyles.text, 
            fontSize: '16px', 
            fontWeight: '600',
            textAlign: 'center'
          }}>
            🎯 Success Rate Trend (Last 7 Days)
          </h3>
          <div style={{ height: '250px' }}>
            <Line data={successRateData} options={chartOptions} />
          </div>
        </div>

        {/* Build Duration Trend */}
        <div style={{
          background: themeStyles.background,
          padding: '20px',
          borderRadius: '8px',
          border: `1px solid ${themeStyles.border}`
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            color: themeStyles.text, 
            fontSize: '16px', 
            fontWeight: '600',
            textAlign: 'center'
          }}>
            ⏱️ Build Duration Trend (Last 7 Days)
          </h3>
          <div style={{ height: '250px' }}>
            <Line data={buildDurationData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {/* Build Frequency */}
        <div style={{
          background: themeStyles.background,
          padding: '20px',
          borderRadius: '8px',
          border: `1px solid ${themeStyles.border}`
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            color: themeStyles.text, 
            fontSize: '16px', 
            fontWeight: '600',
            textAlign: 'center'
          }}>
            📊 Build Frequency (Last 7 Days)
          </h3>
          <div style={{ height: '200px' }}>
            <Bar data={buildFrequencyData} options={chartOptions} />
          </div>
        </div>

        {/* Success vs Failure Distribution */}
        <div style={{
          background: themeStyles.background,
          padding: '20px',
          borderRadius: '8px',
          border: `1px solid ${themeStyles.border}`
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            color: themeStyles.text, 
            fontSize: '16px', 
            fontWeight: '600',
            textAlign: 'center'
          }}>
            🥧 Build Status Distribution
          </h3>
          <div style={{ height: '200px' }}>
            <Doughnut data={successFailureData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Sparkline Summary */}
      <div style={{
        background: themeStyles.background,
        padding: '20px',
        borderRadius: '8px',
        border: `1px solid ${themeStyles.border}`,
        marginTop: '24px'
      }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          color: themeStyles.text, 
          fontSize: '16px', 
          fontWeight: '600',
          textAlign: 'center'
        }}>
          🔍 Quick Insights
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📈</div>
            <div style={{ color: themeStyles.text, fontWeight: '600', marginBottom: '4px' }}>
              {Math.round(chartData.successRates.reduce((a, b) => a + b, 0) / chartData.successRates.length)}%
            </div>
            <div style={{ color: themeStyles.textSecondary, fontSize: '12px' }}>Avg Success Rate</div>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏱️</div>
            <div style={{ color: themeStyles.text, fontWeight: '600', marginBottom: '4px' }}>
              {Math.round(chartData.buildDurations.reduce((a, b) => a + b, 0) / chartData.buildDurations.length)} min
            </div>
            <div style={{ color: themeStyles.textSecondary, fontSize: '12px' }}>Avg Build Time</div>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚀</div>
            <div style={{ color: themeStyles.text, fontWeight: '600', marginBottom: '4px' }}>
              {chartData.buildCounts.reduce((a, b) => a + b, 0)}
            </div>
            <div style={{ color: themeStyles.textSecondary, fontSize: '12px' }}>Total Builds (7d)</div>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📉</div>
            <div style={{ color: themeStyles.text, fontWeight: '600', marginBottom: '4px' }}>
              {Math.max(...chartData.buildDurations)} min
            </div>
            <div style={{ color: themeStyles.textSecondary, fontSize: '12px' }}>Slowest Build</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartsAndTrends; 