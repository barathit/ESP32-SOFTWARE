import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rescueAPI } from '../services/api';
import CommandoLayout from '../components/CommandoLayout';
import { FiPlus, FiActivity, FiMapPin, FiUsers, FiClock, FiAlertCircle } from 'react-icons/fi';
import './CommandoDashboard.css';

const CommandoDashboard = () => {
  const navigate = useNavigate();
  const [activeOperations, setActiveOperations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveOperations();
    const interval = setInterval(fetchActiveOperations, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchActiveOperations = async () => {
    try {
      const operations = await rescueAPI.getActiveOperations();
      setActiveOperations(operations);
    } catch (error) {
      console.error('Error fetching operations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOperation = () => {
    navigate('/pre-rescue');
  };

  const handleViewOperation = (operationId) => {
    navigate(`/monitor/${operationId}`);
  };

  const getOperationDuration = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000 / 60); // minutes
    if (diff < 60) return `${diff}m`;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <CommandoLayout>
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Monitor and manage rescue operations</p>
          </div>
          <button onClick={handleStartOperation} className="btn-start-operation">
            <FiPlus />
            <span>Start New Operation</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon active">
              <FiActivity />
            </div>
            <div className="stat-info">
              <p className="stat-label">Active Operations</p>
              <h3 className="stat-value">{activeOperations.length}</h3>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon fighters">
              <FiUsers />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Fighters</p>
              <h3 className="stat-value">
                {activeOperations.reduce((sum, op) => sum + (op.fighters?.length || 0), 0)}
              </h3>
            </div>
          </div>
        </div>

        {/* Active Operations */}
        <div className="operations-section">
          <div className="section-header">
            <h2 className="section-title">Active Operations</h2>
            {activeOperations.length > 0 && (
              <span className="badge-live">
                <span className="pulse-dot"></span>
                Live
              </span>
            )}
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading operations...</p>
            </div>
          ) : activeOperations.length === 0 ? (
            <div className="empty-state">
              <FiAlertCircle className="empty-icon" />
              <h3>No Active Operations</h3>
              <p>Start a new rescue operation to begin monitoring</p>
              <button onClick={handleStartOperation} className="btn-primary">
                <FiPlus />
                Start Operation
              </button>
            </div>
          ) : (
            <div className="operations-grid">
              {activeOperations.map((op) => (
                <div key={op.operationId} className="operation-card">
                  <div className="operation-header">
                    <div className="operation-id">
                      <FiActivity className="op-icon" />
                      <span>{op.operationId}</span>
                    </div>
                    <span className="operation-badge">Active</span>
                  </div>

                  <div className="operation-body">
                    <div className="operation-detail">
                      <FiMapPin className="detail-icon" />
                      <div>
                        <p className="detail-label">Location</p>
                        <p className="detail-value">{op.location}</p>
                      </div>
                    </div>

                    <div className="operation-detail">
                      <FiActivity className="detail-icon" />
                      <div>
                        <p className="detail-label">Type</p>
                        <p className="detail-value">{op.operationType}</p>
                      </div>
                    </div>

                    <div className="operation-detail">
                      <FiUsers className="detail-icon" />
                      <div>
                        <p className="detail-label">Fighters</p>
                        <p className="detail-value">{op.fighters?.length || 0} Personnel</p>
                      </div>
                    </div>

                    <div className="operation-detail">
                      <FiClock className="detail-icon" />
                      <div>
                        <p className="detail-label">Duration</p>
                        <p className="detail-value">{getOperationDuration(op.startTime)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="operation-footer">
                    <button
                      onClick={() => handleViewOperation(op.operationId)}
                      className="btn-monitor"
                    >
                      <FiActivity />
                      Monitor Live
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CommandoLayout>
  );
};

export default CommandoDashboard;

