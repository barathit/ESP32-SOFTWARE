import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiActivity, FiFileText, FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import './CommandoLayout.css';

const CommandoLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/', icon: <FiHome />, label: 'Dashboard' },
    { path: '/pre-rescue', icon: <FiFileText />, label: 'Start Operation' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="commando-layout">
      {/* Header */}
      <header className="commando-header">
        <div className="header-left">
          <button 
            className="menu-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <div className="header-logo">
            <FiActivity className="logo-icon" />
            <span className="logo-text">Rescue Monitor</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <FiUser className="user-icon" />
            <span className="user-name">{user?.username}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`commando-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="commando-main">
        <div className="content-wrapper">
          {children}
        </div>

        {/* Footer */}
        <footer className="commando-footer">
          <div className="footer-content">
            <p>&copy; 2024 ESP32 Rescue Monitoring System. All rights reserved.</p>
            <div className="footer-links">
              <span>Version 1.0.0</span>
              <span className="separator">•</span>
              <span>Emergency: 911</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default CommandoLayout;
