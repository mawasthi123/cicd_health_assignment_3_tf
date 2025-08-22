import React, { useState } from 'react';

function SettingsPanel({ isDarkMode = false, onClose, onSettingsChange }) {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: 15000,
    notifications: true,
    soundAlerts: false,
    emailAlerts: false,
    slackAlerts: true,
    defaultView: 'table',
    compactMode: false,
    showTimestamps: true,
    timezone: 'local'
  });

  // Theme-aware styles
  const themeStyles = {
    background: isDarkMode ? '#1e293b' : '#f8fafc',
    cardBg: isDarkMode ? '#334155' : 'white',
    border: isDarkMode ? '#475569' : '#e5e7eb',
    text: isDarkMode ? '#f1f5f9' : '#1f2937',
    textSecondary: isDarkMode ? '#94a3b8' : '#6b7280',
    overlay: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)'
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const handleSave = () => {
    localStorage.setItem('dashboard-settings', JSON.stringify(settings));
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = {
      autoRefresh: true,
      refreshInterval: 15000,
      notifications: true,
      soundAlerts: false,
      emailAlerts: false,
      slackAlerts: true,
      defaultView: 'table',
      compactMode: false,
      showTimestamps: true,
      timezone: 'local'
    };
    setSettings(defaultSettings);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: themeStyles.overlay,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        background: themeStyles.cardBg,
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: `1px solid ${themeStyles.border}`
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: `1px solid ${themeStyles.border}`
        }}>
          <h2 style={{
            margin: 0,
            color: themeStyles.text,
            fontSize: '24px',
            fontWeight: '600'
          }}>
            ⚙️ Dashboard Settings
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: themeStyles.textSecondary,
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = themeStyles.background;
              e.target.style.color = themeStyles.text;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = themeStyles.textSecondary;
            }}
          >
            ✕
          </button>
        </div>

        {/* Settings Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Auto-refresh Settings */}
          <div>
            <h3 style={{
              margin: '0 0 16px 0',
              color: themeStyles.text,
              fontSize: '18px',
              fontWeight: '600'
            }}>
              🔄 Auto-refresh Settings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.autoRefresh}
                  onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ color: themeStyles.text }}>Enable auto-refresh</span>
              </label>
              
              {settings.autoRefresh && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginLeft: '24px'
                }}>
                  <span style={{ color: themeStyles.textSecondary }}>Interval:</span>
                  <select
                    value={settings.refreshInterval}
                    onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: `1px solid ${themeStyles.border}`,
                      backgroundColor: themeStyles.cardBg,
                      color: themeStyles.text,
                      fontSize: '14px'
                    }}
                  >
                    <option value={5000}>5 seconds</option>
                    <option value={15000}>15 seconds</option>
                    <option value={30000}>30 seconds</option>
                    <option value={60000}>1 minute</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 style={{
              margin: '0 0 16px 0',
              color: themeStyles.text,
              fontSize: '18px',
              fontWeight: '600'
            }}>
              🔔 Notification Settings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ color: themeStyles.text }}>Enable notifications</span>
              </label>
              
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.soundAlerts}
                  onChange={(e) => handleSettingChange('soundAlerts', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ color: themeStyles.text }}>Sound alerts</span>
              </label>
              
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.slackAlerts}
                  onChange={(e) => handleSettingChange('slackAlerts', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ color: themeStyles.text }}>Slack notifications</span>
              </label>
            </div>
          </div>

          {/* Display Settings */}
          <div>
            <h3 style={{
              margin: '0 0 16px 0',
              color: themeStyles.text,
              fontSize: '18px',
              fontWeight: '600'
            }}>
              🎨 Display Settings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ color: themeStyles.textSecondary }}>Default view:</span>
                <select
                  value={settings.defaultView}
                  onChange={(e) => handleSettingChange('defaultView', e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${themeStyles.border}`,
                    backgroundColor: themeStyles.cardBg,
                    color: themeStyles.text,
                    fontSize: '14px'
                  }}
                >
                  <option value="table">Table</option>
                  <option value="cards">Cards</option>
                </select>
              </div>
              
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.compactMode}
                  onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ color: themeStyles.text }}>Compact mode</span>
              </label>
              
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.showTimestamps}
                  onChange={(e) => handleSettingChange('showTimestamps', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ color: themeStyles.text }}>Show timestamps</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: `1px solid ${themeStyles.border}`
        }}>
          <button
            onClick={handleReset}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: `1px solid ${themeStyles.border}`,
              backgroundColor: themeStyles.cardBg,
              color: themeStyles.textSecondary,
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = themeStyles.background;
              e.target.style.color = themeStyles.text;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = themeStyles.cardBg;
              e.target.style.color = themeStyles.textSecondary;
            }}
          >
            Reset to Defaults
          </button>
          
          <button
            onClick={handleSave}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#3b82f6',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel; 