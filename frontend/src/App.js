import React, { useState, useEffect } from 'react';
import MetricsDashboard from './components/MetricsDashboard';
import SmartAnalytics from './components/SmartAnalytics';
import QuickActions from './components/QuickActions';
// import ChartsAndTrends from './components/ChartsAndTrends';
import BuildsTable from './components/BuildsTable';
import AlertBanner from './components/AlertBanner';
import Notifications from './components/Notifications';
import SettingsPanel from './components/SettingsPanel';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [dashboardSettings, setDashboardSettings] = useState({
    autoRefresh: true,
    refreshInterval: 15000,
    notifications: true,
    defaultView: 'table'
  });

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
    }
    
    // Load dashboard settings
    const savedSettings = localStorage.getItem('dashboard-settings');
    if (savedSettings) {
      setDashboardSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save theme preference and apply to document
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSettingsChange = (newSettings) => {
    setDashboardSettings(newSettings);
  };

  // Theme-aware styles
  const themeStyles = {
    background: isDarkMode ? '#0f172a' : '#f8fafc',
    text: isDarkMode ? '#f1f5f9' : '#1f2937',
    cardBg: isDarkMode ? '#1e293b' : 'white',
    border: isDarkMode ? '#334155' : '#e5e7eb',
    headerBg: isDarkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    footerBg: isDarkMode ? '#1e293b' : 'white',
    footerBorder: isDarkMode ? '#334155' : '#e5e7eb'
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: themeStyles.background,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <header style={{
        background: themeStyles.headerBg,
        color: 'white',
        padding: '24px 0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        marginBottom: '32px'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              fontSize: '32px',
              animation: 'bounce 2s infinite'
            }}>
              🚀
            </div>
            <div>
              <h1 style={{ 
                margin: '0 0 4px 0', 
                fontSize: '28px', 
                fontWeight: '700',
                letterSpacing: '-0.025em'
              }}>
                CI/CD Pipeline Health Dashboard
              </h1>
              <p style={{ 
                margin: '0', 
                fontSize: '16px', 
                opacity: '0.9',
                fontWeight: '400'
              }}>
                Monitor your pipeline health, track builds, and stay informed with real-time metrics
              </p>
            </div>
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            ⚙️ Settings
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 24px 32px 24px'
      }}>
        <AlertBanner isDarkMode={isDarkMode} />
        <MetricsDashboard isDarkMode={isDarkMode} />
        <SmartAnalytics isDarkMode={isDarkMode} />
        <QuickActions isDarkMode={isDarkMode} />
        {/* <ChartsAndTrends isDarkMode={isDarkMode} /> */}
        <BuildsTable isDarkMode={isDarkMode} />
      </main>

      {/* Notifications */}
      <Notifications isDarkMode={isDarkMode} />

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          isDarkMode={isDarkMode}
          onClose={() => setShowSettings(false)}
          onSettingsChange={handleSettingsChange}
        />
      )}

      {/* Footer */}
      <footer style={{
        background: themeStyles.footerBg,
        borderTop: `1px solid ${themeStyles.footerBorder}`,
        padding: '24px 0',
        marginTop: '48px'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 24px',
          textAlign: 'center',
          color: isDarkMode ? '#94a3b8' : '#6b7280',
          fontSize: '14px'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            Built with ❤️ using React & FastAPI
          </p>
          <p style={{ margin: '0', fontSize: '12px' }}>
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}

export default App;