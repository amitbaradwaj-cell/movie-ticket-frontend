import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      if (window.location.pathname.includes('admin')) {
        window.location.href = '/admin';
      }
    }
    
    const message = error.response?.data?.error || 'Something went wrong';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

// Movie API methods
export const movieAPI = {
  // Get all movies
  getMovies: () => api.get('/movies'),
  
  // Get single movie
  getMovie: (id) => api.get(`/movies/${id}`),
  
  // Create movie (admin)
  createMovie: (movieData) => api.post('/movies', movieData),
  
  // Update movie (admin)
  updateMovie: (id, movieData) => api.put(`/movies/${id}`, movieData),
  
  // Delete movie (admin)
  deleteMovie: (id) => api.delete(`/movies/${id}`),
  
  // Get movie showtimes
  getShowtimes: (id) => api.get(`/movies/${id}/showtimes`)
};

// Booking API methods
export const bookingAPI = {
  // Get all bookings
  getBookings: (params = {}) => api.get('/bookings', { params }),
  
  // Get single booking
  getBooking: (id) => api.get(`/bookings/${id}`),
  
  // Create booking
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  
  // Update booking
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data),
  
  // Cancel booking
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
  
  // Get bookings for specific show
  getShowBookings: (movieId, showtime, date) => 
    api.get(`/bookings/movie/${movieId}/showtime/${showtime}?date=${date}`)
};

// Seat API methods
export const seatAPI = {
  // Get seat layout
  getLayout: () => api.get('/seats/layout'),
  
  // Update seat layout (admin)
  updateLayout: (layout) => api.put('/seats/layout', { layout }),
  
  // Get seat availability
  getAvailability: (movieId, showtime, date) =>
    api.get(`/seats/availability?movieId=${movieId}&showtime=${showtime}&date=${date}`),
  
  // Block seats (admin)
  blockSeats: (seats, reason) => api.post('/seats/block', { seats, reason }),
  
  // Unblock seats (admin)
  unblockSeats: (seats) => api.post('/seats/unblock', { seats }),
  
  // Get seating statistics
  getStats: (date) => api.get(`/seats/stats${date ? `?date=${date}` : ''}`)
};

// Admin API methods
export const adminAPI = {
  // Admin login
  login: (password) => api.post('/admin/login', { password }),
  
  // Get dashboard data
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Generate reports
  getReports: (type, startDate, endDate) =>
    api.get(`/admin/reports?type=${type}&startDate=${startDate}&endDate=${endDate}`),
  
  // Backup data
  backup: () => api.post('/admin/backup'),
  
  // Restore data
  restore: (backup) => api.post('/admin/restore', { backup })
};

export default api;
