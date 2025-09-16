import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const Admin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast.error('Please enter the admin password');
      return;
    }

    setLoading(true);

    try {
      const response = await adminAPI.login(password);
      const { token } = response.data.data;
      
      // Store token in localStorage
      localStorage.setItem('adminToken', token);
      
      toast.success('Admin login successful');
      navigate('/admin/dashboard');
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Invalid admin password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="admin-login">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-icon">
              <Lock size={48} />
            </div>
            <h1>Admin Access</h1>
            <p>Enter your administrator password to access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="password">
                <User size={20} />
                Administrator Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="password-input"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="btn btn-primary btn-lg btn-block"
            >
              {loading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          <div className="admin-login-info">
            <h3>Admin Features:</h3>
            <ul>
              <li>Manage movies and showtimes</li>
              <li>Configure seat layouts</li>
              <li>View and manage bookings</li>
              <li>Generate reports and analytics</li>
              <li>Export and import data</li>
            </ul>
          </div>

          <div className="admin-login-help">
            <p className="help-text">
              <strong>Default Password:</strong> admin123
            </p>
            <p className="help-text">
              Make sure to change this password in production!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
