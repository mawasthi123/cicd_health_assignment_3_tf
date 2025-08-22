import React, { useEffect, useState } from 'react';
import { fetchMetrics } from '../api';

function AlertBanner({ isDarkMode = false }) {
  const [lastStatus, setLastStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Theme-aware styles
  const themeStyles = {
    background: isDarkMode ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)' : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    color: isDarkMode ? '#fecaca' : '#991b1b',
    border: isDarkMode ? '#f87171' : '#f87171',
    textPrimary: isDarkMode ? '#fecaca' : '#7f1d1d',
    textSecondary: isDarkMode ? '#fca5a5' : '#991b1b'
  };

  useEffect(() => {
    fetchMetrics()
      .then(res => {
        setLastStatus(res.data.last_build_status);
        if (res.data.last_build_status === 'failure') {
          setIsVisible(true);
        }
      })
      .catch(() => setLastStatus(null));
  }, []);

  if (lastStatus !== 'failure') {
    return null;
  }

  return (
    <div style={{ 
      background: themeStyles.background,
      color: themeStyles.color,
      padding: '20px 24px',
      borderRadius: '12px',
      marginBottom: '24px',
      border: `1px solid ${themeStyles.border}`,
      boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.1), 0 2px 4px -1px rgba(239, 68, 68, 0.06)',
      animation: isVisible ? 'slideInDown 0.5s ease-out' : 'none',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        fontSize: '80px',
        opacity: '0.1',
        transform: 'rotate(15deg)'
      }}>
        ⚠️
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          fontSize: '24px',
          animation: 'pulse 2s infinite'
        }}>
          🚨
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '18px', 
            fontWeight: '600',
            color: themeStyles.textPrimary
          }}>
            Pipeline Alert: Build Failure Detected
          </h3>
          <p style={{ 
            margin: '0', 
            fontSize: '14px',
            color: themeStyles.textSecondary,
            lineHeight: '1.5'
          }}>
            The last build has failed! Please check the build logs below and take immediate action to resolve the issue.
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '12px',
            padding: '6px 12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '20px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontWeight: '500'
          }}>
            ⏰ {new Date().toLocaleTimeString()}
          </span>
          
          <button 
            onClick={() => setIsVisible(false)}
            style={{
              background: 'none',
              border: `1px solid ${themeStyles.border}`,
              color: themeStyles.textPrimary,
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f87171';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = themeStyles.textPrimary;
            }}
          >
            Dismiss
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}

export default AlertBanner;