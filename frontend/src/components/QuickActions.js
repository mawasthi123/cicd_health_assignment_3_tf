import React, { useState } from 'react';

function QuickActions({ isDarkMode = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

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

  const quickActions = [
    {
      id: 'trigger-build',
      icon: '🚀',
      title: 'Trigger Build',
      description: 'Start a new pipeline build',
      category: 'pipeline',
      color: themeStyles.info,
      action: () => handleAction('trigger-build')
    },
    {
      id: 'deploy-staging',
      icon: '🌐',
      title: 'Deploy to Staging',
      description: 'Deploy latest build to staging environment',
      category: 'deployment',
      color: themeStyles.warning,
      action: () => handleAction('deploy-staging')
    },
    {
      id: 'deploy-production',
      icon: '🎯',
      title: 'Deploy to Production',
      description: 'Deploy to production environment',
      category: 'deployment',
      color: themeStyles.success,
      action: () => handleAction('deploy-production')
    },
    {
      id: 'rollback',
      icon: '↩️',
      title: 'Rollback',
      description: 'Rollback to previous deployment',
      category: 'deployment',
      color: themeStyles.error,
      action: () => handleAction('rollback')
    },
    {
      id: 'run-tests',
      icon: '🧪',
      title: 'Run Tests',
      description: 'Execute test suite',
      category: 'testing',
      color: themeStyles.info,
      action: () => handleAction('run-tests')
    },
    {
      id: 'security-scan',
      icon: '🔒',
      title: 'Security Scan',
      description: 'Run security vulnerability scan',
      category: 'security',
      color: themeStyles.warning,
      action: () => handleAction('security-scan')
    },
    {
      id: 'backup',
      icon: '💾',
      title: 'Create Backup',
      description: 'Create system backup',
      category: 'maintenance',
      color: themeStyles.info,
      action: () => handleAction('backup')
    },
    {
      id: 'health-check',
      icon: '🏥',
      title: 'Health Check',
      description: 'Run system health diagnostics',
      category: 'monitoring',
      color: themeStyles.success,
      action: () => handleAction('health-check')
    }
  ];

  const handleAction = (actionId) => {
    setSelectedAction(actionId);
    
    // Simulate action execution
    setTimeout(() => {
      setSelectedAction(null);
    }, 2000);
  };

  const getActionStatus = (actionId) => {
    if (selectedAction === actionId) {
      return { status: 'running', text: 'Executing...', icon: '⏳' };
    }
    return { status: 'idle', text: 'Ready', icon: '✅' };
  };

  const categories = [
    { id: 'all', name: 'All Actions', icon: '⚡' },
    { id: 'pipeline', name: 'Pipeline', icon: '🚀' },
    { id: 'deployment', name: 'Deployment', icon: '🌐' },
    { id: 'testing', name: 'Testing', icon: '🧪' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧' },
    { id: 'monitoring', name: 'Monitoring', icon: '📊' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredActions = selectedCategory === 'all' 
    ? quickActions 
    : quickActions.filter(action => action.category === selectedCategory);

  return (
    <div style={{
      background: themeStyles.cardBg,
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: `1px solid ${themeStyles.border}`,
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <h2 style={{ 
          margin: 0, 
          color: themeStyles.text, 
          fontSize: '20px', 
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ⚡ Quick Actions
        </h2>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: `1px solid ${themeStyles.border}`,
            color: themeStyles.textSecondary,
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
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
          {isExpanded ? '📁 Collapse' : '📂 Expand'}
        </button>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: `1px solid ${selectedCategory === category.id ? category.id === 'all' ? themeStyles.info : themeStyles.border : themeStyles.border}`,
              backgroundColor: selectedCategory === category.id ? (category.id === 'all' ? themeStyles.info : themeStyles.background) : themeStyles.cardBg,
              color: selectedCategory === category.id ? (category.id === 'all' ? 'white' : themeStyles.text) : themeStyles.textSecondary,
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      {/* Actions Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isExpanded ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {filteredActions.map(action => {
          const status = getActionStatus(action.id);
          return (
            <div
              key={action.id}
              style={{
                background: themeStyles.background,
                padding: '20px',
                borderRadius: '12px',
                border: `1px solid ${themeStyles.border}`,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={action.action}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Background Pattern */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                fontSize: '60px',
                opacity: '0.05',
                transform: 'rotate(15deg)'
              }}>
                {action.icon}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  fontSize: '24px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  backgroundColor: `${action.color}20`,
                  border: `1px solid ${action.color}40`
                }}>
                  {action.icon}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: themeStyles.text,
                    marginBottom: '4px'
                  }}>
                    {action.title}
                  </div>
                  
                  {isExpanded && (
                    <div style={{
                      fontSize: '13px',
                      color: themeStyles.textSecondary,
                      lineHeight: '1.4'
                    }}>
                      {action.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: status.status === 'running' ? themeStyles.warning : themeStyles.success,
                fontWeight: '500'
              }}>
                <span>{status.icon}</span>
                {status.text}
              </div>

              {/* Action Button */}
              <button
                style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: action.color,
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: status.status === 'running' ? 0.6 : 1
                }}
                disabled={status.status === 'running'}
                onMouseEnter={(e) => {
                  if (status.status !== 'running') {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {status.status === 'running' ? 'Executing...' : 'Execute'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      {isExpanded && (
        <div style={{
          marginTop: '24px',
          padding: '20px',
          background: themeStyles.background,
          borderRadius: '8px',
          border: `1px solid ${themeStyles.border}`
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            color: themeStyles.text,
            fontSize: '16px',
            fontWeight: '600'
          }}>
            📊 Action Statistics
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: themeStyles.success,
                marginBottom: '4px'
              }}>
                {quickActions.length}
              </div>
              <div style={{
                fontSize: '12px',
                color: themeStyles.textSecondary
              }}>
                Available Actions
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: themeStyles.info,
                marginBottom: '4px'
              }}>
                {categories.length - 1}
              </div>
              <div style={{
                fontSize: '12px',
                color: themeStyles.textSecondary
              }}>
                Action Categories
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: themeStyles.warning,
                marginBottom: '4px'
              }}>
                0
              </div>
              <div style={{
                fontSize: '12px',
                color: themeStyles.textSecondary
              }}>
                Actions Running
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuickActions; 