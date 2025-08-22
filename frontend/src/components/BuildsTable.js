import React, { useEffect, useState } from 'react';
import { fetchBuilds, fetchBuildLogs } from '../api';

function BuildsTable({ isDarkMode = false }) {
  const [builds, setBuilds] = useState([]);
  const [filteredBuilds, setFilteredBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logModal, setLogModal] = useState({ open: false, logs: '', buildId: null });
  
  // New state for interactions
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  // Theme-aware styles
  const themeStyles = {
    background: isDarkMode ? '#1e293b' : '#f8fafc',
    cardBg: isDarkMode ? '#334155' : 'white',
    border: isDarkMode ? '#475569' : '#e5e7eb',
    text: isDarkMode ? '#f1f5f9' : '#1f2937',
    textSecondary: isDarkMode ? '#94a3b8' : '#6b7280',
    headerBg: isDarkMode ? '#475569' : '#f8fafc',
    rowBg: isDarkMode ? '#334155' : '#f9fafb',
    rowBgAlt: isDarkMode ? '#475569' : '#ffffff'
  };

  useEffect(() => {
    fetchBuilds()
      .then(res => {
        setBuilds(res.data);
        setFilteredBuilds(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load builds');
        setLoading(false);
      });
  }, []);

  // Filter and sort builds
  useEffect(() => {
    let filtered = builds.filter(build => {
      const matchesSearch = build.id.toString().includes(searchTerm) || 
                           build.status.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || build.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort builds
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'duration':
          aVal = a.duration;
          bVal = b.duration;
          break;
        case 'started_at':
          aVal = new Date(a.started_at);
          bVal = new Date(b.started_at);
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          aVal = a.id;
          bVal = b.id;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredBuilds(filtered);
  }, [builds, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const handleViewLogs = (id) => {
    fetchBuildLogs(id)
      .then(res => setLogModal({ open: true, logs: res.data.logs, buildId: id }))
      .catch(() => setLogModal({ open: true, logs: 'Failed to load logs', buildId: id }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      success: { 
        color: '#059669', 
        bg: '#d1fae5', 
        text: 'Success', 
        icon: '✅',
        borderColor: '#10b981'
      },
      failure: { 
        color: '#dc2626', 
        bg: '#fee2e2', 
        text: 'Failed', 
        icon: '❌',
        borderColor: '#ef4444'
      },
      running: { 
        color: '#2563eb', 
        bg: '#dbeafe', 
        text: 'Running', 
        icon: '🔄',
        borderColor: '#3b82f6'
      },
      pending: { 
        color: '#d97706', 
        bg: '#fef3c7', 
        text: 'Pending', 
        icon: '⏳',
        borderColor: '#f59e0b'
      },
      cancelled: { 
        color: '#6b7280', 
        bg: '#f3f4f6', 
        text: 'Cancelled', 
        icon: '🚫',
        borderColor: '#9ca3af'
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span style={{
        backgroundColor: config.bg,
        color: config.color,
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        border: `2px solid ${config.borderColor}`,
        boxShadow: `0 2px 4px ${config.borderColor}20`,
        transition: 'all 0.2s ease',
        cursor: 'default'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = `0 4px 8px ${config.borderColor}30`;
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = `0 2px 4px ${config.borderColor}20`;
      }}
      >
        {config.icon} {config.text}
      </span>
    );
  };

  const formatDuration = (duration) => {
    if (duration < 60) return `${duration}s`;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
      Loading builds...
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
        🚀 Recent Builds
      </h2>
      
      {/* Search and Filter Controls */}
      <div style={{
        background: themeStyles.cardBg,
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${themeStyles.border}`
      }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Search Bar */}
          <div style={{ flex: '1', minWidth: '200px' }}>
            <input
              type="text"
              placeholder="🔍 Search by Build ID or Status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: `1px solid ${themeStyles.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                backgroundColor: themeStyles.cardBg,
                color: themeStyles.text
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = themeStyles.border}
            />
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '150px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: `1px solid ${themeStyles.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: themeStyles.cardBg,
                color: themeStyles.text,
                cursor: 'pointer'
              }}
            >
              <option value="all">📊 All Statuses</option>
              <option value="success">✅ Success</option>
              <option value="failure">❌ Failed</option>
              <option value="running">🔄 Running</option>
              <option value="pending">⏳ Pending</option>
            </select>
          </div>

          {/* Results Count */}
          <div style={{
            padding: '8px 16px',
            backgroundColor: themeStyles.headerBg,
            borderRadius: '8px',
            fontSize: '14px',
            color: themeStyles.textSecondary,
            fontWeight: '500'
          }}>
            📈 {filteredBuilds.length} of {builds.length} builds
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: `1px solid ${themeStyles.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            fontSize: '14px',
            color: themeStyles.textSecondary,
            fontWeight: '500'
          }}>
            📱 View Mode:
          </span>
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: `1px solid ${viewMode === 'table' ? '#3b82f6' : themeStyles.border}`,
                backgroundColor: viewMode === 'table' ? '#3b82f6' : themeStyles.cardBg,
                color: viewMode === 'table' ? 'white' : themeStyles.textSecondary,
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📊 Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: `1px solid ${viewMode === 'cards' ? '#3b82f6' : themeStyles.border}`,
                backgroundColor: viewMode === 'cards' ? '#3b82f6' : themeStyles.cardBg,
                color: viewMode === 'cards' ? 'white' : themeStyles.textSecondary,
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🃏 Cards
            </button>
          </div>
        </div>
      </div>

      <div style={{ 
        background: themeStyles.cardBg,
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        border: `1px solid ${themeStyles.border}`
      }}>
        {viewMode === 'table' ? (
          <div style={{ 
            overflowX: 'auto'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: themeStyles.headerBg,
                  borderBottom: `2px solid ${themeStyles.border}`
                }}>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: themeStyles.text,
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('id')}
                  >
                    Build ID {getSortIcon('id')}
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: themeStyles.text,
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('status')}
                  >
                    Status {getSortIcon('status')}
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: themeStyles.text,
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('duration')}
                  >
                    Duration {getSortIcon('duration')}
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: themeStyles.text,
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('started_at')}
                  >
                    Started At {getSortIcon('started_at')}
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: themeStyles.text,
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Finished At
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'center', 
                    fontWeight: '600', 
                    color: themeStyles.text,
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBuilds.map((build, index) => (
                  <tr key={build.id} style={{ 
                    backgroundColor: index % 2 === 0 ? themeStyles.rowBgAlt : themeStyles.rowBg,
                    borderBottom: `1px solid ${themeStyles.border}`,
                    transition: 'background-color 0.2s ease'
                  }}>
                    <td style={{ 
                      padding: '16px', 
                      fontWeight: '600',
                      color: themeStyles.text,
                      fontFamily: 'monospace'
                    }}>
                      #{build.id}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {getStatusBadge(build.status)}
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      color: themeStyles.textSecondary,
                      fontWeight: '500'
                    }}>
                      {formatDuration(build.duration)}
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      color: themeStyles.textSecondary,
                      fontSize: '13px'
                    }}>
                      {formatDate(build.started_at)}
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      color: themeStyles.textSecondary,
                      fontSize: '13px'
                    }}>
                      {formatDate(build.finished_at)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleViewLogs(build.id)}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#2563eb';
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#3b82f6';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        📋 View Logs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Card View for Mobile */
          <div style={{
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {filteredBuilds.map((build) => (
              <div key={build.id} style={{
                background: themeStyles.background,
                padding: '16px',
                borderRadius: '8px',
                border: `1px solid ${themeStyles.border}`,
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: themeStyles.text,
                    fontFamily: 'monospace'
                  }}>
                    #{build.id}
                  </span>
                  {getStatusBadge(build.status)}
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <span style={{
                      fontSize: '12px',
                      color: themeStyles.textSecondary
                    }}>Duration:</span>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: themeStyles.text
                    }}>
                      {formatDuration(build.duration)}
                    </div>
                  </div>
                  
                  <div>
                    <span style={{
                      fontSize: '12px',
                      color: themeStyles.textSecondary
                    }}>Started:</span>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: themeStyles.text
                    }}>
                      {formatDate(build.started_at)}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleViewLogs(build.id)}
                  style={{
                    width: '100%',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#3b82f6';
                  }}
                >
                  📋 View Logs
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Modal */}
      {logModal.open && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{ 
            background: 'white',
            borderRadius: '12px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc'
            }}>
              <h3 style={{ 
                margin: 0, 
                color: '#1f2937',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                📋 Build #{logModal.buildId} Logs
              </h3>
              <button 
                onClick={() => setLogModal({ open: false, logs: '', buildId: null })}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6b7280';
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ 
              padding: '24px',
              maxHeight: '60vh',
              overflow: 'auto'
            }}>
              <pre style={{ 
                margin: 0,
                padding: '16px',
                backgroundColor: '#1f2937',
                color: '#f9fafb',
                borderRadius: '8px',
                fontSize: '13px',
                lineHeight: '1.5',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {logModal.logs}
              </pre>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default BuildsTable;