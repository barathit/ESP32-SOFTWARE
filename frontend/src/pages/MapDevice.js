import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import './MapDevice.css';

const MapDevice = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fighterId: '',
    deviceId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await adminAPI.mapDevice(formData.fighterId, formData.deviceId);
      setSuccess('Device mapped successfully!');
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to map device');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Map ESP32 Device to Fighter</h1>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Fighter ID *</label>
            <input
              type="text"
              name="fighterId"
              value={formData.fighterId}
              onChange={handleChange}
              required
              className="input"
              placeholder="e.g., FIGHTER-001"
            />
          </div>

          <div className="form-group">
            <label>ESP32 Device ID *</label>
            <input
              type="text"
              name="deviceId"
              value={formData.deviceId}
              onChange={handleChange}
              required
              className="input"
              placeholder="e.g., TX-44b7b3f8"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Mapping...' : 'Map Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MapDevice;

