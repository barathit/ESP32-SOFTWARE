import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rescueAPI } from '../services/api';
import CommandoLayout from '../components/CommandoLayout';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import './PreRescueForm.css';

const PreRescueForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: '',
    operationType: '',
    description: '',
    fighters: [{ fighterId: '', deviceId: '' }],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFighterChange = (index, field, value) => {
    const newFighters = [...formData.fighters];
    newFighters[index][field] = value;
    setFormData({ ...formData, fighters: newFighters });
  };

  const addFighter = () => {
    setFormData({
      ...formData,
      fighters: [...formData.fighters, { fighterId: '', deviceId: '' }],
    });
  };

  const removeFighter = (index) => {
    const newFighters = formData.fighters.filter((_, i) => i !== index);
    setFormData({ ...formData, fighters: newFighters });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate fighters
    const validFighters = formData.fighters.filter(
      (f) => f.fighterId.trim() && f.deviceId.trim()
    );

    if (validFighters.length === 0) {
      setError('At least one fighter with both Fighter ID and Device ID is required');
      setLoading(false);
      return;
    }

    try {
      const data = {
        ...formData,
        fighters: validFighters,
      };
      const response = await rescueAPI.startOperation(data);
      navigate(`/monitor/${response.operation.operationId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start operation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommandoLayout>
      <div className="form-container">
        <div className="form-card">
          <h1 className="form-title">Start New Operation</h1>
          <p className="form-subtitle">Fill in the details to begin a rescue operation</p>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="input"
              placeholder="Enter operation location"
            />
          </div>

          <div className="form-group">
            <label>Operation Type *</label>
            <input
              type="text"
              name="operationType"
              value={formData.operationType}
              onChange={handleChange}
              required
              className="input"
              placeholder="e.g., Fire Rescue, Building Collapse"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              rows="4"
              placeholder="Additional details about the operation"
            />
          </div>

          <div className="form-group">
            <label>Fighters *</label>
            <div className="fighters-list">
              {formData.fighters.map((fighter, index) => (
                <div key={index} className="fighter-input-group">
                  <input
                    type="text"
                    placeholder="Fighter ID"
                    value={fighter.fighterId}
                    onChange={(e) => handleFighterChange(index, 'fighterId', e.target.value)}
                    className="input"
                  />
                  <input
                    type="text"
                    placeholder="Device ID (ESP32)"
                    value={fighter.deviceId}
                    onChange={(e) => handleFighterChange(index, 'deviceId', e.target.value)}
                    className="input"
                  />
                  {formData.fighters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFighter(index)}
                      className="btn-icon-danger"
                      title="Remove fighter"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addFighter} className="btn-add-fighter">
              <FiPlus />
              Add Fighter
            </button>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-submit" disabled={loading}>
              {loading ? 'Starting...' : 'Start Operation'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </CommandoLayout>
  );
};

export default PreRescueForm;

