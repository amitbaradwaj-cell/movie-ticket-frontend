import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, DollarSign, Clock, Calendar } from 'lucide-react';
import { movieAPI, seatAPI, bookingAPI } from '../services/api';
import toast from 'react-hot-toast';

const SeatSelection = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const date = searchParams.get('date');
  const showtime = searchParams.get('showtime');
  
  const [movie, setMovie] = useState(null);
  const [seatLayout, setSeatLayout] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!date || !showtime) {
      toast.error('Missing booking information');
      navigate(`/movie/${id}`);
      return;
    }
    
    fetchData();
  }, [id, date, showtime]);

  const fetchData = async () => {
    try {
      const [movieResponse, availabilityResponse] = await Promise.all([
        movieAPI.getMovie(id),
        seatAPI.getAvailability(id, showtime, date)
      ]);
      
      setMovie(movieResponse.data.data);
      setSeatLayout(availabilityResponse.data.data.seatMap);
      setBookedSeats(availabilityResponse.data.data.bookedSeats);
    } catch (error) {
      toast.error('Failed to load seat information');
      navigate(`/movie/${id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatId, seatData) => {
    if (!seatData.available) {
      toast.error('This seat is not available');
      return;
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(seat => seat !== seatId));
    } else {
      if (selectedSeats.length >= 6) {
        toast.error('Maximum 6 seats can be selected');
        return;
      }
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const getSeatPrice = (seatType) => {
    if (!movie?.price) return 12;
    return movie.price[seatType] || 12;
  };

  const calculateTotalPrice = () => {
    if (!seatLayout) return 0;
    
    let total = 0;
    selectedSeats.forEach(seatId => {
      const [row, seatNum] = [seatId, parseInt(seatId.slice(1))];
      const rowIndex = row.charCodeAt(0) - 65; // A=0, B=1, etc.
      
      // Find seat in layout
      const rowData = seatLayout.find(r => r.row === row);
      if (rowData) {
        const seat = rowData.seats.find(s => s.number === seatNum);
        if (seat) {
          total += getSeatPrice(seat.type);
        }
      }
    });
    
    return total;
  };

  const proceedToBooking = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    const bookingData = {
      movieId: id,
      movieTitle: movie.title,
      date,
      showtime,
      seats: selectedSeats,
      totalPrice: calculateTotalPrice()
    };

    navigate('/booking/new', { state: bookingData });
  };

  const getSeatClassName = (seat) => {
    const seatId = `${seat.row || ''}${seat.number}`;
    let className = 'seat';
    
    if (!seat.available) {
      className += ' seat--unavailable';
    } else if (selectedSeats.includes(seatId)) {
      className += ' seat--selected';
    } else {
      className += ` seat--${seat.type}`;
    }
    
    if (seat.isWheelchair) {
      className += ' seat--wheelchair';
    }
    
    return className;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading seat map...</p>
      </div>
    );
  }

  if (!movie || !seatLayout) {
    return (
      <div className="error-container">
        <h2>Unable to load seating information</h2>
        <button 
          onClick={() => navigate(`/movie/${id}`)}
          className="btn btn-primary"
        >
          Back to Movie
        </button>
      </div>
    );
  }

  return (
    <div className="seat-selection">
      <div className="container">
        {/* Header */}
        <div className="seat-selection-header">
          <button 
            onClick={() => navigate(-1)}
            className="back-button"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          
          <div className="booking-info">
            <h1>{movie.title}</h1>
            <div className="booking-meta">
              <span className="meta-item">
                <Calendar size={16} />
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="meta-item">
                <Clock size={16} />
                {showtime}
              </span>
            </div>
          </div>
        </div>

        <div className="seat-selection-content">
          {/* Seat Map */}
          <div className="seat-map-section">
            {/* Screen */}
            <div className="screen-indicator">
              <div className="screen">SCREEN</div>
            </div>

            {/* Seat Legend */}
            <div className="seat-legend">
              <div className="legend-item">
                <div className="seat seat--available"></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="seat seat--selected"></div>
                <span>Selected</span>
              </div>
              <div className="legend-item">
                <div className="seat seat--unavailable"></div>
                <span>Occupied</span>
              </div>
              <div className="legend-item">
                <div className="seat seat--premium"></div>
                <span>Premium (${movie.price?.premium || 18})</span>
              </div>
              <div className="legend-item">
                <div className="seat seat--vip"></div>
                <span>VIP (${movie.price?.vip || 25})</span>
              </div>
            </div>

            {/* Seat Grid */}
            <div className="seat-grid">
              {seatLayout.map((row) => (
                <div key={row.row} className="seat-row">
                  <div className="row-label">{row.row}</div>
                  <div className="seats">
                    {row.seats.map((seat) => {
                      const seatId = `${row.row}${seat.number}`;
                      return (
                        <button
                          key={seatId}
                          className={getSeatClassName({ ...seat, row: row.row })}
                          onClick={() => handleSeatClick(seatId, seat)}
                          disabled={!seat.available}
                          title={`${seatId} - ${seat.type} - $${getSeatPrice(seat.type)}`}
                        >
                          {seat.number}
                        </button>
                      );
                    })}
                  </div>
                  <div className="row-label">{row.row}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="booking-summary">
            <div className="summary-card">
              <h3>Booking Summary</h3>
              
              <div className="summary-item">
                <span>Movie:</span>
                <span>{movie.title}</span>
              </div>
              
              <div className="summary-item">
                <span>Date:</span>
                <span>{new Date(date).toDateString()}</span>
              </div>
              
              <div className="summary-item">
                <span>Time:</span>
                <span>{showtime}</span>
              </div>
              
              <div className="summary-item">
                <span>
                  <Users size={16} />
                  Selected Seats:
                </span>
                <span>
                  {selectedSeats.length === 0 ? 'None' : selectedSeats.join(', ')}
                </span>
              </div>
              
              <div className="summary-total">
                <span>
                  <DollarSign size={16} />
                  Total:
                </span>
                <span className="total-amount">${calculateTotalPrice()}</span>
              </div>
              
              <button 
                className="btn btn-primary btn-lg btn-block"
                onClick={proceedToBooking}
                disabled={selectedSeats.length === 0}
              >
                Continue to Booking
              </button>
              
              <p className="booking-note">
                * Maximum 6 seats can be selected per booking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
