import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Search, Filter } from 'lucide-react';
import { movieAPI } from '../services/api';
import toast from 'react-hot-toast';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movies, searchTerm, selectedGenre]);

  const fetchMovies = async () => {
    try {
      const response = await movieAPI.getMovies();
      const moviesData = response.data.data || [];
      setMovies(moviesData);
    } catch (error) {
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = movies;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre) {
      filtered = filtered.filter(movie =>
        movie.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
  };

  const getUniqueGenres = () => {
    const genres = new Set();
    movies.forEach(movie => {
      if (movie.genre) {
        movie.genre.split(',').forEach(genre => {
          genres.add(genre.trim());
        });
      }
    });
    return Array.from(genres).sort();
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
    <div className="movies-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Now Playing</h1>
          <p>Discover and book tickets for our latest movies</p>
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="search-filter">
            <div className="search-input-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="genre-filter">
            <Filter size={20} />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="genre-select"
            >
              <option value="">All Genres</option>
              {getUniqueGenres().map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="movies-grid">
          {filteredMovies.length === 0 ? (
            <div className="no-movies">
              <p>No movies found matching your criteria.</p>
            </div>
          ) : (
            filteredMovies.map((movie) => (
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
                      to={`/movie/${movie.id}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-meta">
                    <span className="rating">
                      <Star size={16} />
                      {movie.rating}
                    </span>
                    <span className="duration">
                      <Clock size={16} />
                      {movie.duration} min
                    </span>
                  </div>
                  <p className="movie-genre">{movie.genre}</p>
                  <p className="movie-description">
                    {movie.description.length > 100 
                      ? `${movie.description.substring(0, 100)}...` 
                      : movie.description
                    }
                  </p>
                  {movie.showtimes && movie.showtimes.length > 0 && (
                    <div className="showtimes">
                      <h4>Showtimes:</h4>
                      <div className="showtime-list">
                        {movie.showtimes.map((time, index) => (
                          <span key={index} className="showtime">
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="movie-actions">
                    <Link 
                      to={`/movie/${movie.id}`}
                      className="btn btn-primary btn-block"
                    >
                      Book Tickets
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Results count */}
        <div className="results-footer">
          <p>Showing {filteredMovies.length} of {movies.length} movies</p>
        </div>
      </div>
    </div>
  );
};

export default Movies;
