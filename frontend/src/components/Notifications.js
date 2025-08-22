import React, { useState, useEffect } from 'react';

function Notifications({ isDarkMode = false }) {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

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
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const types = ['success', 'warning', 'error', 'info'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      if (Math.random() < 0.3) { // 30% chance of notification
        addNotification({
          id: Date.now(),
          type: randomType,
          title: getNotificationTitle(randomType),
          message: getNotificationMessage(randomType),
          timestamp: new Date()
        });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getNotificationTitle = (type) => {
    const titles = {
      success: '🎉 Build Successful!',
      warning: '⚠️ Build Warning',
      error: '🚨 Build Failed!',
      info: 'ℹ️ Pipeline Update'
    };
    return titles[type] || 'Notification';
  };

  const getNotificationMessage = (type) => {
    const messages = {
      success: 'Build #124 completed successfully in 3m 45s',
      warning: 'Build #125 completed with warnings - check logs',
      error: 'Build #126 failed due to dependency issues',
      info: 'New deployment pipeline configured'
    };
    return messages[type] || 'New notification received';
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only last 5
    setIsVisible(true);
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 8000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notifications.length <= 1) {
      setIsVisible(false);
    }
  };

  const getNotificationStyle = (type) => {
    const baseStyle = {
      padding: '16px 20px',
      borderRadius: '8px',
      marginBottom: '12px',
      border: '1px solid',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      animation: 'slideInRight 0.3s ease-out',
      position: 'relative',
      overflow: 'hidden'
    };

    const typeStyles = {
      success: {
        backgroundColor: `${themeStyles.success}10`,
        borderColor: themeStyles.success,
        color: themeStyles.success
      },
      warning: {
        backgroundColor: `${themeStyles.warning}10`,
        borderColor: themeStyles.warning,
        color: themeStyles.warning
      },
      error: {
        backgroundColor: `${themeStyles.error}10`,
        borderColor: themeStyles.error,
        color: themeStyles.error
      },
      info: {
        backgroundColor: `${themeStyles.info}10`,
        borderColor: themeStyles.info,
        color: themeStyles.info
      }
    };

    return { ...baseStyle, ...typeStyles[type] };
  };

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      maxWidth: '400px',
      width: '100%'
    }}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={getNotificationStyle(notification.type)}
        >
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            fontSize: '40px',
            opacity: '0.1',
            transform: 'rotate(15deg)'
          }}>
            {notification.type === 'success' && '✅'}
            {notification.type === 'warning' && '⚠️'}
            {notification.type === 'error' && '🚨'}
            {notification.type === 'info' && 'ℹ️'}
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ fontSize: '20px' }}>
              {notification.type === 'success' && '🎉'}
              {notification.type === 'warning' && '⚠️'}
              {notification.type === 'error' && '🚨'}
              {notification.type === 'info' && 'ℹ️'}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: '600',
                fontSize: '14px',
                marginBottom: '4px'
              }}>
                {notification.title}
              </div>
              <div style={{
                fontSize: '12px',
                opacity: '0.8',
                lineHeight: '1.4'
              }}>
                {notification.message}
              </div>
              <div style={{
                fontSize: '10px',
                opacity: '0.6',
                marginTop: '4px'
              }}>
                {notification.timestamp.toLocaleTimeString()}
              </div>
            </div>
            
            <button
              onClick={() => removeNotification(notification.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '16px',
                opacity: '0.6',
                transition: 'opacity 0.2s ease',
                padding: '4px'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.6'}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Notifications; 