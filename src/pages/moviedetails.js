import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, Star, Calendar, Users, ArrowLeft, Ticket } from 'lucide-react';
import { movieAPI } from '../services/api';
import toast from 'react-hot-toast';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShowtime, setSelectedShowtime] = useState('');

  useEffect(() => {
    fetchMovie();
    setDefaultDate();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await movieAPI.getMovie(id);
      setMovie(response.data.data);
    } catch (error) {
      toast.error('Movie not found');
      navigate('/movies');
    } finally {
      setLoading(false);
    }
  };

  const setDefaultDate = () => {
    const today = new Date();
    const dateString = today.toISOString().split('T');
    setSelectedDate(dateString);
  };

  const getNextSevenDays = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split('T'),
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        isToday: i === 0
      });
    }
    return dates;
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedShowtime) {
      toast.error('Please select date and showtime');
      return;
    }
    
    navigate(`/movie/${id}/seats?date=${selectedDate}&showtime=${selectedShowtime}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-container">
        <h2>Movie not found</h2>
        <Link to="/movies" className="btn btn-primary">
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="movie-details">
      {/* Hero Section */}
      <div className="movie-hero">
        <div className="movie-hero-bg">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="hero-bg-image"
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="container">
          <div className="movie-hero-content">
            <button 
              onClick={() => navigate(-1)}
              className="back-button"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            
            <div className="movie-hero-info">
              <div className="movie-poster-large">
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x600?text=No+Poster';
                  }}
                />
              </div>
              
              <div className="movie-info-content">
                <h1 className="movie-title-large">{movie.title}</h1>
                
                <div className="movie-meta-large">
                  <span className="meta-item">
                    <Star size={20} />
                    {movie.rating}
                  </span>
                  <span className="meta-item">
                    <Clock size={20} />
                    {movie.duration} min
                  </span>
                  <span className="meta-item">
                    <Users size={20} />
                    {movie.genre}
                  </span>
                </div>
                
                <p className="movie-description-large">
                  {movie.description}
                </p>
                
                {/* Pricing Info */}
                <div className="pricing-info">
                  <h3>Ticket Prices</h3>
                  <div className="price-list">
                    <div className="price-item">
                      <span>Regular</span>
                      <span>${movie.price?.regular || 12}</span>
                    </div>
                    <div className="price-item">
                      <span>Premium</span>
                      <span>${movie.price?.premium || 18}</span>
                    </div>
                    <div className="price-item">
                      <span>VIP</span>
                      <span>${movie.price?.vip || 25}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="booking-section">
        <div className="container">
          <div className="booking-card">
            <h2>
              <Calendar size={24} />
              Book Your Tickets
            </h2>
            
            {/* Date Selection */}
            <div className="date-selection">
              <h3>Select Date</h3>
              <div className="date-grid">
                {getNextSevenDays().map((date) => (
                  <button
                    key={date.value}
                    className={`date-option ${selectedDate === date.value ? 'selected' : ''} ${date.isToday ? 'today' : ''}`}
                    onClick={() => setSelectedDate(date.value)}
                  >
                    <span className="date-label">{date.label}</span>
                    {date.isToday && <span className="today-badge">Today</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Showtime Selection */}
            <div className="showtime-selection">
              <h3>Select Showtime</h3>
              <div className="showtime-grid">
                {movie.showtimes && movie.showtimes.length > 0 ? (
                  movie.showtimes.map((time, index) => (
                    <button
                      key={index}
                      className={`showtime-option ${selectedShowtime === time ? 'selected' : ''}`}
                      onClick={() => setSelectedShowtime(time)}
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <p className="no-showtimes">No showtimes available</p>
                )}
              </div>
            </div>

            {/* Book Button */}
            <div className="booking-actions">
              <button 
                className="btn btn-primary btn-lg btn-block"
                onClick={handleBooking}
                disabled={!selectedDate || !selectedShowtime}
              >
                <Ticket size={20} />
                Select Seats & Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
