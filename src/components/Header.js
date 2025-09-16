import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Search, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Search:', searchQuery);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <Film className="logo-icon" />
            <span className="logo-text">CinemaMax</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav desktop-nav">
            <Link 
              to="/" 
              className={`nav-link \${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/movies" 
              className={`nav-link \${isActive('/movies') ? 'active' : ''}`}
            >
              Movies
            </Link>
            <Link 
              to="/admin" 
              className={`nav-link \${isActive('/admin') || location.pathname.includes('admin') ? 'active' : ''}`}
            >
              Admin
            </Link>
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="search-input"
              />
              <button type="submit" className="search-button">
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="nav mobile-nav">
            <Link 
              to="/" 
              className={`nav-link \${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/movies" 
              className={`nav-link \${isActive('/movies') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Movies
            </Link>
            <Link 
              to="/admin" 
              className={`nav-link \${isActive('/admin') || location.pathname.includes('admin') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
