import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Film, 
  Users, 
  DollarSign, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Download,
  Upload,
  Settings
} from 'lucide-react';
import { adminAPI, movieAPI, bookingAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const [dashResponse, moviesResponse, bookingsResponse] = await Promise.all([
        adminAPI.getDashboard(),
        movieAPI.getMovies(),
        bookingAPI.getBookings()
      ]);
      
      setDashboardData(dashResponse.data.data);
      setMovies(moviesResponse.data.data || []);
      setBookings(bookingsResponse.data.data || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const deleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) {
      return;
    }

    try {
      await movieAPI.deleteMovie(movieId);
      toast.success('Movie deleted successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete movie');
    }
  };

  const exportData = async () => {
    try {
      const response = await adminAPI.backup();
      const backup = response.data.data;
      
      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cinema-backup-${new Date().toISOString().split('T')}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <div className="admin-title">
              <h1>🎬 CinemaMax Admin</h1>
              <p>Manage your cinema operations</p>
            </div>
            <button onClick={handleLogout} className="btn btn-outline">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="admin-content">
          {/* Navigation Tabs */}
          <div className="admin-tabs">
            <button
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 size={20} />
              Overview
            </button>
            <button
              className={`tab ${activeTab === 'movies' ? 'active' : ''}`}
              onClick={() => setActiveTab('movies')}
            >
              <Film size={20} />
              Movies
            </button>
            <button
              className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <Users size={20} />
              Bookings
            </button>
            <button
              className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} />
              Settings
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Film size={32} />
                  </div>
                  <div className="stat-info">
                    <h3>{dashboardData?.overview.totalMovies || movies.length}</h3>
                    <p>Active Movies</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <Users size={32} />
                  </div>
                  <div className="stat-info">
                    <h3>{dashboardData?.overview.totalBookings || bookings.length}</h3>
                    <p>Total Bookings</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <Calendar size={32} />
                  </div>
                  <div className="stat-info">
                    <h3>{dashboardData?.overview.todayBookings || 0}</h3>
                    <p>Today's Bookings</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <DollarSign size={32} />
                  </div>
                  <div className="stat-info">
                    <h3>${dashboardData?.overview.totalRevenue || 0}</h3>
                    <p>Total Revenue</p>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="recent-bookings">
                <h2>Recent Bookings</h2>
                <div className="bookings-table">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="booking-row">
                      <div className="booking-info">
                        <strong>{booking.customerName}</strong>
                        <span>{booking.movieTitle || 'Unknown Movie'}</span>
                      </div>
                      <div className="booking-details">
                        <span>{booking.date}</span>
                        <span>{booking.showtime}</span>
                        <span className="booking-status">{booking.status}</span>
                      </div>
                      <div className="booking-amount">
                        ${booking.totalPrice}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Movies Tab */}
          {activeTab === 'movies' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Manage Movies</h2>
                <button className="btn btn-primary">
                  <Plus size={20} />
                  Add New Movie
                </button>
              </div>

              <div className="movies-grid">
                {movies.map((movie) => (
                  <div key={movie.id} className="admin-movie-card">
                    <div className="movie-poster-small">
                      <img 
                        src={movie.poster} 
                        alt={movie.title}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150x225?text=No+Poster';
                        }}
                      />
                    </div>
                    <div className="movie-details">
                      <h3>{movie.title}</h3>
                      <p>{movie.genre}</p>
                      <p>{movie.duration} minutes • {movie.rating}</p>
                      <div className="movie-actions">
                        <button className="btn btn-small btn-outline">
                          <Edit size={16} />
                          Edit
                        </button>
                        <button 
                          className="btn btn-small btn-danger"
                          onClick={() => deleteMovie(movie.id)}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>All Bookings</h2>
                <div className="booking-filters">
                  <select className="filter-select">
                    <option value="">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <input 
                    type="date" 
                    className="filter-date"
                    defaultValue={new Date().toISOString().split('T')}
                  />
                </div>
              </div>

              <div className="bookings-table-full">
                <div className="table-header">
                  <div>Customer</div>
                  <div>Movie</div>
                  <div>Date & Time</div>
                  <div>Seats</div>
                  <div>Amount</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                
                {bookings.map((booking) => (
                  <div key={booking.id} className="table-row">
                    <div className="customer-cell">
                      <strong>{booking.customerName}</strong>
                      <span>{booking.customerEmail}</span>
                    </div>
                    <div>{booking.movieTitle || 'Unknown Movie'}</div>
                    <div>
                      <div>{booking.date}</div>
                      <div>{booking.showtime}</div>
                    </div>
                    <div>{booking.seats?.join(', ') || 'N/A'}</div>
                    <div>${booking.totalPrice}</div>
                    <div>
                      <span className={`status ${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="action-buttons">
                      <button className="btn btn-small btn-outline">View</button>
                      <button className="btn btn-small btn-danger">Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="tab-content">
              <div className="settings-section">
                <h2>System Settings</h2>
                
                <div className="setting-group">
                  <h3>Data Management</h3>
                  <div className="setting-actions">
                    <button 
                      onClick={exportData}
                      className="btn btn-outline"
                    >
                      <Download size={20} />
                      Export Data
                    </button>
                    <button className="btn btn-outline">
                      <Upload size={20} />
                      Import Data
                    </button>
                  </div>
                  <p className="setting-description">
                    Export your cinema data for backup or import from a backup file.
                  </p>
                </div>

                <div className="setting-group">
                  <h3>Seat Layout Configuration</h3>
                  <button className="btn btn-primary">
                    <Settings size={20} />
                    Configure Seats
                  </button>
                  <p className="setting-description">
                    Modify the theater seat layout, pricing, and availability.
                  </p>
                </div>

                <div className="setting-group">
                  <h3>Security</h3>
                  <button className="btn btn-outline">
                    Change Admin Password
                  </button>
                  <p className="setting-description">
                    Update your administrator password for security.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
