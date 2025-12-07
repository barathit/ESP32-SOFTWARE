import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { rescueAPI } from '../services/api';
import CommandoLayout from '../components/CommandoLayout';
import './PostRescueForm.css';

const PostRescueForm = () => {
  const { operationId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    casualties: 0,
    rescued: 0,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [operation, setOperation] = useState(null);

  useEffect(() => {
    fetchOperation();
  }, [operationId]);

  const fetchOperation = async () => {
    try {
      const op = await rescueAPI.getOperation(operationId);
      setOperation(op);
    } catch (error) {
      console.error('Error fetching operation:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await rescueAPI.endOperation({
        operationId,
        ...formData,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to end operation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommandoLayout>
      <div className="form-container">
        <div className="form-card">
          <h1 className="form-title">End Operation</h1>
          <p className="form-subtitle">Complete the operation and provide final details</p>
        {error && <div className="error-message">{error}</div>}
        {operation && (
          <div className="operation-info">
            <p><strong>Operation ID:</strong> {operation.operationId}</p>
            <p><strong>Location:</strong> {operation.location}</p>
            <p><strong>Started:</strong> {new Date(operation.startTime).toLocaleString()}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Casualties</label>
            <input
              type="number"
              name="casualties"
              value={formData.casualties}
              onChange={handleChange}
              min="0"
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Rescued</label>
            <input
              type="number"
              name="rescued"
              value={formData.rescued}
              onChange={handleChange}
              min="0"
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input"
              rows="6"
              placeholder="Additional notes about the operation"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Ending...' : 'End Operation'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </CommandoLayout>
  );
};

export default PostRescueForm;

