import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSocket } from '../services/socket';
import { rescueAPI, telemetryAPI } from '../services/api';
import CommandoLayout from '../components/CommandoLayout';
import './LiveMonitoring.css';

const LiveMonitoring = () => {
  const { operationId } = useParams();
  const navigate = useNavigate();
  const [operation, setOperation] = useState(null);
  const [fighters, setFighters] = useState([]);
  const [selectedFighter, setSelectedFighter] = useState(null);
  const [telemetry, setTelemetry] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOperation();
    initSocketConnection();

    return () => {
      const socket = getSocket();
      socket.off('telemetry_update');
    };
  }, [operationId]);

  const fetchOperation = async () => {
    try {
      const op = await rescueAPI.getOperation(operationId);
      setOperation(op);
      setFighters(op.fighters || []);
      
      // Fetch latest telemetry for each fighter
      const latestTelemetry = await telemetryAPI.getTelemetry(operationId);
      const telemetryMap = {};
      latestTelemetry.forEach((reading) => {
        if (!telemetryMap[reading.fighterId] || 
            new Date(reading.timestamp) > new Date(telemetryMap[reading.fighterId].timestamp)) {
          telemetryMap[reading.fighterId] = reading;
        }
      });
      setTelemetry(telemetryMap);
    } catch (error) {
      console.error('Error fetching operation:', error);
    } finally {
      setLoading(false);
    }
  };

  const initSocketConnection = () => {
    const socket = getSocket();
    socket.emit('join_operation', operationId);

    socket.on('telemetry_update', (data) => {
      if (data.operationId === operationId) {
        setTelemetry((prev) => ({
          ...prev,
          [data.fighterId]: {
            ...prev[data.fighterId],
            ...data,
            timestamp: data.timestamp || new Date(),
          },
        }));
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'emergency':
        return 'status-emergency';
      case 'need_attention':
        return 'status-attention';
      default:
        return 'status-normal';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'emergency':
        return '🔴';
      case 'need_attention':
        return '🟠';
      default:
        return '🟢';
    }
  };

  const handleEndOperation = () => {
    navigate(`/post-rescue/${operationId}`);
  };

  if (loading) {
    return <div className="loading">Loading operation data...</div>;
  }

  return (
    <CommandoLayout>
      <div className="monitoring-container">
        <div className="monitoring-header">
          <div>
            <h1 className="monitoring-title">Live Operation Monitoring</h1>
            <p className="monitoring-subtitle">Operation ID: {operationId}</p>
          </div>
          <button onClick={handleEndOperation} className="btn-end-operation">
            End Operation
          </button>
        </div>

        <div className="monitoring-content">
        {operation && (
          <div className="card">
            <h2>Operation Details</h2>
            <p><strong>Location:</strong> {operation.location}</p>
            <p><strong>Type:</strong> {operation.operationType}</p>
            <p><strong>Started:</strong> {new Date(operation.startTime).toLocaleString()}</p>
          </div>
        )}

        <div className="card">
          <h2>Fighter Status Overview</h2>
          <div className="fighters-grid">
            {fighters.map((fighter) => {
              const fighterTelemetry = telemetry[fighter.fighterId];
              const status = fighterTelemetry?.status || 'normal';
              return (
                <div
                  key={fighter.fighterId}
                  className={`fighter-card ${getStatusColor(status)}`}
                  onClick={() => setSelectedFighter(fighter.fighterId)}
                >
                  <div className="fighter-header">
                    <span className="status-icon">{getStatusIcon(status)}</span>
                    <h3>{fighter.fighterId}</h3>
                  </div>
                  <p>Device: {fighter.deviceId}</p>
                  {fighterTelemetry ? (
                    <>
                      <p>HR: {fighterTelemetry.heartRate} bpm</p>
                      <p>SpO2: {fighterTelemetry.spO2}%</p>
                      <p>Temp: {fighterTelemetry.temperature}°C</p>
                      <p className="status-text">Status: {status.replace('_', ' ').toUpperCase()}</p>
                    </>
                  ) : (
                    <p className="no-data">No data received</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selectedFighter && (
          <div className="card">
            <h2>Fighter Details: {selectedFighter}</h2>
            <button
              onClick={() => setSelectedFighter(null)}
              className="btn btn-secondary"
            >
              Close
            </button>
            {telemetry[selectedFighter] ? (
              <div className="fighter-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Heart Rate</label>
                    <span>{telemetry[selectedFighter].heartRate} bpm</span>
                  </div>
                  <div className="detail-item">
                    <label>SpO2</label>
                    <span>{telemetry[selectedFighter].spO2}%</span>
                  </div>
                  <div className="detail-item">
                    <label>Temperature</label>
                    <span>{telemetry[selectedFighter].temperature}°C</span>
                  </div>
                  <div className="detail-item">
                    <label>Methane (m2)</label>
                    <span>{telemetry[selectedFighter].methane} ppm</span>
                  </div>
                  <div className="detail-item">
                    <label>CO (m7)</label>
                    <span>{telemetry[selectedFighter].co} ppm</span>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <span className={getStatusColor(telemetry[selectedFighter].status)}>
                      {telemetry[selectedFighter].status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="timestamp">
                  Last Update: {new Date(telemetry[selectedFighter].timestamp).toLocaleString()}
                </p>
              </div>
            ) : (
              <p>No telemetry data available</p>
            )}
          </div>
        )}
        </div>
      </div>
    </CommandoLayout>
  );
};

export default LiveMonitoring;

