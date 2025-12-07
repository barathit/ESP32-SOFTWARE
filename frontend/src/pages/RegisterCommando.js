import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import './RegisterCommando.css';

const RegisterCommando = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    commandoId: '',
    name: '',
    email: '',
    phone: '',
    password: '',
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
      const response = await adminAPI.registerCommando(formData);
      setSuccess(
        `Commando registered successfully! Login: ${response.commando.commandoId} / [Password you entered]`
      );
      setTimeout(() => {
        navigate('/admin');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register commando');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Register New Commando</h1>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Commando ID *</label>
            <input
              type="text"
              name="commandoId"
              value={formData.commandoId}
              onChange={handleChange}
              required
              className="input"
              placeholder="e.g., COMMANDO-001"
            />
            <p className="form-hint">This will be used as the login username</p>
          </div>

          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <p className="form-hint">Login will use Commando ID as username</p>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="input"
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
              {loading ? 'Registering...' : 'Register Commando'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCommando;

