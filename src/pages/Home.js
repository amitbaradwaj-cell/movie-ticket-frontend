import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Ticket } from 'lucide-react';
import { movieAPI } from '../services/api';
import toast from 'react-hot-toast';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredMovie, setFeaturedMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await movieAPI.getMovies();
      const moviesData = response.data.data || [];
      setMovies(moviesData);
      setFeaturedMovie(moviesData[0] || null);
    } catch (error) {
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      {featuredMovie && (
        <section className="hero">
          <div className="hero-background">
            <img 
              src={featuredMovie.poster} 
              alt={featuredMovie.title}
              className="hero-image"
            />
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <div className="container">
              <div className="hero-info">
                <h1 className="hero-title">{featuredMovie.title}</h1>
                <p className="hero-description">
                  {featuredMovie.description}
                </p>
                <div className="hero-meta">
                  <span className="meta-item">
                    <Star size={16} />
                    {featuredMovie.rating}
                  </span>
                  <span className="meta-item">
                    <Clock size={16} />
                    {featuredMovie.duration} min
                  </span>
                  <span className="meta-item">
                    {featuredMovie.genre}
                  </span>
                </div>
                <div className="hero-actions">
                  <Link 
                    to={`/movie/\${featuredMovie.id}`}
                    className="btn btn-primary btn-lg"
                  >
                    <Ticket size={20} />
                    Book Now
                  </Link>
                  <Link 
                    to={`/movie/\${featuredMovie.id}`}
                    className="btn btn-outline btn-lg"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Now Playing Section */}
      <section className="now-playing">
        <div className="container">
          <div className="section-header">
            <h2>Now Playing</h2>
            <Link to="/movies" className="view-all-link">
              View All Movies
            </Link>
          </div>

          <div className="movies-grid">
            {movies.slice(0, 6).map((movie) => (
              <div key={movie.id} className="movie-card">
                <div className="movie-poster">
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                    }}
                  />
                  <div className="movie-overlay">
                    <Link 
                      to={`/movie/\${movie.id}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-meta">
                    <span className="rating">{movie.rating}</span>
                    <span className="duration">{movie.duration} min</span>
                  </div>
                  <p className="movie-genre">{movie.genre}</p>
                  {movie.showtimes && movie.showtimes.length > 0 && (
                    <div className="showtimes">
                      {movie.showtimes.slice(0, 3).map((time, index) => (
                        <span key={index} className="showtime">
                          {time}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Ticket size={32} />
              </div>
              <h3>Easy Booking</h3>
              <p>Book your tickets online with just a few clicks. Choose your seats and enjoy the show!</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Star size={32} />
              </div>
              <h3>Premium Experience</h3>
              <p>Enjoy our comfortable seating with regular, premium, and VIP options available.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Clock size={32} />
              </div>
              <h3>Flexible Showtimes</h3>
              <p>Multiple showtimes throughout the day to fit your schedule perfectly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
