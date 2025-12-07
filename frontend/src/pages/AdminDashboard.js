import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [commandos, setCommandos] = useState([]);
  const [summary, setSummary] = useState(null);
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [hasRealData, setHasRealData] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sample static data
  const sampleSummary = {
    summary: {
      totalOperations: 12,
      activeOperations: 3,
      completedOperations: 9,
      totalCommandos: 6,
      totalFighters: 5,
      totalTelemetryReadings: 1247,
      emergencyReadings: 5,
      attentionReadings: 23,
    },
  };

  const sampleOperations = [
    {
      _id: 'sample1',
      operationId: 'OP-20240115-001',
      commandoId: 'COMMANDO-001',
      location: 'Building A, Floor 3',
      operationType: 'Fire Rescue',
      fighters: [{ fighterId: 'FIGHTER-001', deviceId: 'TX-44b7b3f8' }],
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'active',
      telemetryCount: 145,
      emergencyCount: 0,
      attentionCount: 2,
      duration: null,
    },
    {
      _id: 'sample2',
      operationId: 'OP-20240115-002',
      commandoId: 'COMMANDO-002',
      location: 'Industrial Complex',
      operationType: 'Gas Leak',
      fighters: [
        { fighterId: 'FIGHTER-002', deviceId: 'TX-44b7b3f9' },
        { fighterId: 'FIGHTER-003', deviceId: 'TX-44b7b3fa' },
      ],
      startTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'active',
      telemetryCount: 289,
      emergencyCount: 1,
      attentionCount: 5,
      duration: null,
    },
    {
      _id: 'sample3',
      operationId: 'OP-20240114-003',
      commandoId: 'COMMANDO-001',
      location: 'Residential Area',
      operationType: 'Building Collapse',
      fighters: [
        { fighterId: 'FIGHTER-001', deviceId: 'TX-44b7b3f8' },
        { fighterId: 'FIGHTER-004', deviceId: 'TX-44b7b3fb' },
      ],
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed',
      telemetryCount: 523,
      emergencyCount: 2,
      attentionCount: 8,
      duration: 12450,
    },
    {
      _id: 'sample4',
      operationId: 'OP-20240114-004',
      commandoId: 'COMMANDO-003',
      location: 'Warehouse District',
      operationType: 'Fire Rescue',
      fighters: [{ fighterId: 'FIGHTER-005', deviceId: 'TX-44b7b3fc' }],
      startTime: new Date(Date.now() - 30 * 60 * 60 * 1000),
      status: 'completed',
      telemetryCount: 290,
      emergencyCount: 0,
      attentionCount: 3,
      duration: 8900,
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'commandos') {
        const data = await adminAPI.getCommandos();
        setCommandos(data || []);
      } else if (activeTab === 'home') {
        try {
          const summaryData = await adminAPI.getSummary();
          const opsData = await adminAPI.getOperations(filterStatus === 'all' ? null : filterStatus, 50);
          
          // Check if we have real data
          if (summaryData && summaryData.summary && summaryData.summary.totalOperations > 0) {
            setHasRealData(true);
            setSummary(summaryData);
          } else {
            setHasRealData(false);
            setSummary(sampleSummary);
          }
          
          if (opsData && opsData.length > 0) {
            setHasRealData(true);
            setOperations(opsData);
          } else {
            setHasRealData(false);
            // Filter sample data based on filterStatus
            if (filterStatus === 'all') {
              setOperations(sampleOperations);
            } else {
              setOperations(sampleOperations.filter(op => op.status === filterStatus));
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          // Use sample data on error
          setHasRealData(false);
          setSummary(sampleSummary);
          if (filterStatus === 'all') {
            setOperations(sampleOperations);
          } else {
            setOperations(sampleOperations.filter(op => op.status === filterStatus));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Use sample data on error
      if (activeTab === 'home') {
        setHasRealData(false);
        setSummary(sampleSummary);
        setOperations(sampleOperations);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, filterStatus]);

  // Reset filter when switching tabs
  useEffect(() => {
    if (activeTab === 'home') {
      setFilterStatus('all');
    }
  }, [activeTab]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'completed':
        return 'status-normal';
      case 'cancelled':
        return 'status-inactive';
      default:
        return '';
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'commandos', label: 'Commandos', icon: '👥' },
    { id: 'fighters', label: 'Fighter Mapping', icon: '🦾' },
    { id: 'search', label: 'Search', icon: '🔍' },
  ];

  return (
    <div className="admin-dashboard-wrapper">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {sidebarOpen && <span className="sidebar-label">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-icon">👤</span>
            {sidebarOpen && <span className="user-name">{user?.username}</span>}
          </div>
          <button onClick={logout} className="sidebar-logout">
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="mobile-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h1>Super Admin Dashboard</h1>
          </div>
          <div className="header-right">
            <span className="welcome-text">Welcome, {user?.username}</span>
            <button onClick={logout} className="btn btn-danger desktop-logout">
              Logout
            </button>
          </div>
        </header>

        <div className="content-container">
          {activeTab === 'home' && (
            <>
              {/* Sample Data Notice */}
              {!hasRealData && !loading && (
                <div className="sample-data-notice">
                  <p>📊 Showing sample data. Real data will appear once operations are created.</p>
                </div>
              )}

              {/* Analytics Dashboard */}
              {summary && (
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <div className="analytics-icon">📊</div>
                    <div className="analytics-content">
                      <h3>Total Operations</h3>
                      <p className="analytics-value">{summary.summary.totalOperations}</p>
                    </div>
                  </div>
                  <div className="analytics-card active-ops">
                    <div className="analytics-icon">⚡</div>
                    <div className="analytics-content">
                      <h3>Active Operations</h3>
                      <p className="analytics-value">{summary.summary.activeOperations}</p>
                    </div>
                  </div>
                  <div className="analytics-card completed-ops">
                    <div className="analytics-icon">✅</div>
                    <div className="analytics-content">
                      <h3>Completed</h3>
                      <p className="analytics-value">{summary.summary.completedOperations}</p>
                    </div>
                  </div>
                  <div className="analytics-card">
                    <div className="analytics-icon">👥</div>
                    <div className="analytics-content">
                      <h3>Total Commandos</h3>
                      <p className="analytics-value">{summary.summary.totalCommandos}</p>
                    </div>
                  </div>
                  <div className="analytics-card">
                    <div className="analytics-icon">🦾</div>
                    <div className="analytics-content">
                      <h3>Total Fighters</h3>
                      <p className="analytics-value">{summary.summary.totalFighters}</p>
                    </div>
                  </div>
                  <div className="analytics-card emergency">
                    <div className="analytics-icon">🚨</div>
                    <div className="analytics-content">
                      <h3>Emergency Readings</h3>
                      <p className="analytics-value">{summary.summary.emergencyReadings}</p>
                    </div>
                  </div>
                  <div className="analytics-card attention">
                    <div className="analytics-icon">⚠️</div>
                    <div className="analytics-content">
                      <h3>Need Attention</h3>
                      <p className="analytics-value">{summary.summary.attentionReadings}</p>
                    </div>
                  </div>
                  <div className="analytics-card">
                    <div className="analytics-icon">📡</div>
                    <div className="analytics-content">
                      <h3>Total Telemetry</h3>
                      <p className="analytics-value">{summary.summary.totalTelemetryReadings}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Operations List */}
              <div className="card">
                <div className="card-header">
                  <h2>All Operations</h2>
                  <div className="filter-buttons">
                    <button
                      className={filterStatus === 'all' ? 'active' : ''}
                      onClick={async () => {
                        setFilterStatus('all');
                        setLoading(true);
                        try {
                          const data = await adminAPI.getOperations(null, 50);
                          if (data && data.length > 0) {
                            setHasRealData(true);
                            setOperations(data);
                          } else {
                            setHasRealData(false);
                            setOperations(sampleOperations);
                          }
                        } catch (error) {
                          console.error('Error fetching operations:', error);
                          setHasRealData(false);
                          setOperations(sampleOperations);
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      All
                    </button>
                    <button
                      className={filterStatus === 'active' ? 'active' : ''}
                      onClick={async () => {
                        setFilterStatus('active');
                        setLoading(true);
                        try {
                          const data = await adminAPI.getOperations('active', 50);
                          if (data && data.length > 0) {
                            setHasRealData(true);
                            setOperations(data);
                          } else {
                            setHasRealData(false);
                            setOperations(sampleOperations.filter(op => op.status === 'active'));
                          }
                        } catch (error) {
                          console.error('Error fetching active operations:', error);
                          setHasRealData(false);
                          setOperations(sampleOperations.filter(op => op.status === 'active'));
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      Active
                    </button>
                    <button
                      className={filterStatus === 'completed' ? 'active' : ''}
                      onClick={async () => {
                        setFilterStatus('completed');
                        setLoading(true);
                        try {
                          const data = await adminAPI.getOperations('completed', 50);
                          if (data && data.length > 0) {
                            setHasRealData(true);
                            setOperations(data);
                          } else {
                            setHasRealData(false);
                            setOperations(sampleOperations.filter(op => op.status === 'completed'));
                          }
                        } catch (error) {
                          console.error('Error fetching completed operations:', error);
                          setHasRealData(false);
                          setOperations(sampleOperations.filter(op => op.status === 'completed'));
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      Completed
                    </button>
                  </div>
                </div>
                {loading ? (
                  <p>Loading operations...</p>
                ) : operations.length === 0 ? (
                  <p>No operations found</p>
                ) : (
                  <div className="operations-table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Operation ID</th>
                          <th>Commando</th>
                          <th>Location</th>
                          <th>Type</th>
                          <th>Fighters</th>
                          <th>Start Time</th>
                          <th>Duration</th>
                          <th>Status</th>
                          <th>Telemetry</th>
                          <th>Alerts</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {operations.map((op) => (
                          <tr key={op._id}>
                            <td className="operation-id">{op.operationId}</td>
                            <td>{op.commandoId}</td>
                            <td>{op.location}</td>
                            <td>{op.operationType}</td>
                            <td>{op.fighters?.length || 0}</td>
                            <td>{new Date(op.startTime).toLocaleString()}</td>
                            <td>{formatDuration(op.duration)}</td>
                            <td>
                              <span className={`status-badge ${getStatusColor(op.status)}`}>
                                {op.status}
                              </span>
                            </td>
                            <td>
                              <span className="telemetry-count">{op.telemetryCount || 0}</span>
                            </td>
                            <td>
                              {op.emergencyCount > 0 && (
                                <span className="alert-badge emergency-badge">
                                  🚨 {op.emergencyCount}
                                </span>
                              )}
                              {op.attentionCount > 0 && (
                                <span className="alert-badge attention-badge">
                                  ⚠️ {op.attentionCount}
                                </span>
                              )}
                              {op.emergencyCount === 0 && op.attentionCount === 0 && (
                                <span className="alert-badge normal-badge">✓ Safe</span>
                              )}
                            </td>
                            <td>
                              <button
                                onClick={() => navigate(`/admin/operation/${op.operationId}`)}
                                className="btn btn-primary btn-small"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'commandos' && (
            <div className="card">
              <div className="card-header">
                <h2>Commando List</h2>
              </div>
              {loading ? (
                <p>Loading commandos...</p>
              ) : commandos.length === 0 ? (
                <p>No commandos found</p>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Commando ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commandos.map((commando) => (
                        <tr key={commando._id}>
                          <td>{commando.commandoId}</td>
                          <td>{commando.name}</td>
                          <td>{commando.email}</td>
                          <td>{commando.phone || 'N/A'}</td>
                          <td>
                            <span className={commando.isActive ? 'status-active' : 'status-inactive'}>
                              {commando.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'fighters' && (
            <div className="card">
              <div className="card-header">
                <h2>Fighter & Device Mapping</h2>
                <button
                  onClick={() => navigate('/admin/map-device')}
                  className="btn btn-primary"
                >
                  Map New Device
                </button>
              </div>
              <p>Use the button above to map ESP32 devices to fighters</p>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="card">
              <h2>Search Operations</h2>
              <SearchOperations />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const SearchOperations = () => {
  const [searchType, setSearchType] = useState('commandoId');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    setLoading(true);
    try {
      const params = { [searchType]: searchValue };
      const data = await adminAPI.search(params);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-form">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="input"
        >
          <option value="commandoId">Commando ID</option>
          <option value="fighterId">Fighter ID</option>
          <option value="operationId">Operation ID</option>
        </select>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Enter search value"
          className="input"
        />
        <button onClick={handleSearch} className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {results && (
        <div className="search-results">
          {results.commando && (
            <div className="result-section">
              <h3>Commando</h3>
              <pre>{JSON.stringify(results.commando, null, 2)}</pre>
            </div>
          )}
          {results.fighter && (
            <div className="result-section">
              <h3>Fighter</h3>
              <pre>{JSON.stringify(results.fighter, null, 2)}</pre>
            </div>
          )}
          {results.operation && (
            <div className="result-section">
              <h3>Operation</h3>
              <pre>{JSON.stringify(results.operation, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
