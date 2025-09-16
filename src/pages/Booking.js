import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Check, Calendar, Clock, Users, DollarSign, User, Mail, Phone } from 'lucide-react';
import { bookingAPI } from '../services/api';
import toast from 'react-hot-toast';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [bookingData, setBookingData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    // Check if we have booking data from seat selection
    if (location.state) {
      setBookingData(location.state);
    } else if (id && id !== 'new') {
      // If accessing existing booking, fetch it
      fetchExistingBooking(id);
    } else {
      // No booking data, redirect to movies
      toast.error('No booking information found');
      navigate('/movies');
    }
  }, [location.state, id]);

  const fetchExistingBooking = async (bookingId) => {
    try {
      const response = await bookingAPI.getBooking(bookingId);
      const booking = response.data.data;
      setBookingData(booking);
      setCustomerInfo({
        name: booking.customerName,
        email: booking.customerEmail,
        phone: booking.customerPhone
      });
      setIsConfirmed(true);
      setBookingId(booking.id);
    } catch (error) {
      toast.error('Booking not found');
      navigate('/movies');
    }
  };

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!customerInfo.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    
    if (!customerInfo.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    
    if (!customerInfo.email.includes('@')) {
      toast.error('Please enter a valid email');
      return false;
    }
    
    if (!customerInfo.phone.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    
    return true;
  };

  const confirmBooking = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const bookingPayload = {
        movieId: bookingData.movieId,
        showtime: bookingData.showtime,
        date: bookingData.date,
        seats: bookingData.seats,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone
      };
      
      const response = await bookingAPI.createBooking(bookingPayload);
      const newBooking = response.data.data;
      
      setBookingId(newBooking.id);
      setIsConfirmed(true);
      
      toast.success('Booking confirmed successfully!');
      
      // Update URL to show confirmed booking
      navigate(`/booking/${newBooking.id}`, { replace: true });
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to confirm booking';
      toast.error(errorMessage);
      
      if (error.response?.data?.conflictingSeats) {
        toast.error(`Seats ${error.response.data.conflictingSeats.join(', ')} are no longer available`);
      }
    } finally {
      setLoading(false);
    }
  };

  const printBooking = () => {
    window.print();
  };

  const goToMovies = () => {
    navigate('/movies');
  };

  if (!bookingData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading booking information...</p>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-container">
          {!isConfirmed ? (
            // Booking Form
            <div className="booking-form">
              <div className="booking-header">
                <h1>Complete Your Booking</h1>
                <p>Please provide your details to confirm the reservation</p>
              </div>

              <div className="booking-content">
                {/* Booking Summary */}
                <div className="booking-summary-section">
                  <h2>Booking Summary</h2>
                  <div className="summary-card">
                    <div className="movie-info">
                      <h3>{bookingData.movieTitle}</h3>
                    </div>
                    
                    <div className="booking-details">
                      <div className="detail-item">
                        <Calendar size={20} />
                        <span>
                          {new Date(bookingData.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <div className="detail-item">
                        <Clock size={20} />
                        <span>{bookingData.showtime}</span>
                      </div>
                      
                      <div className="detail-item">
                        <Users size={20} />
                        <span>{bookingData.seats.join(', ')}</span>
                      </div>
                      
                      <div className="detail-item total">
                        <DollarSign size={20} />
                        <span className="total-amount">${bookingData.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information Form */}
                <div className="customer-form-section">
                  <h2>Your Information</h2>
                  <div className="form-card">
                    <div className="form-group">
                      <label htmlFor="name">
                        <User size={20} />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">
                        <Mail size={20} />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={customerInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">
                        <Phone size={20} />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button
                        type="button"
                        onClick={confirmBooking}
                        disabled={loading}
                        className="btn btn-primary btn-lg btn-block"
                      >
                        {loading ? (
                          <>
                            <div className="loading-spinner-small"></div>
                            Confirming...
                          </>
                        ) : (
                          <>
                            <Check size={20} />
                            Confirm Booking
                          </>
                        )}
                      </button>
                    </div>
                    
                    <p className="booking-note">
                      * Required fields. Your booking will be confirmed instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Booking Confirmation
            <div className="booking-confirmation">
              <div className="confirmation-header">
                <div className="success-icon">
                  <Check size={48} />
                </div>
                <h1>Booking Confirmed!</h1>
                <p>Your tickets have been reserved successfully</p>
                {bookingId && (
                  <div className="booking-id">
                    <strong>Booking ID: {bookingId}</strong>
                  </div>
                )}
              </div>

              <div className="confirmation-details">
                <div className="details-card">
                  <h2>Booking Details</h2>
                  
                  <div className="detail-row">
                    <span className="label">Movie:</span>
                    <span className="value">{bookingData.movieTitle}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">Date:</span>
                    <span className="value">
                      {new Date(bookingData.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">Time:</span>
                    <span className="value">{bookingData.showtime}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">Seats:</span>
                    <span className="value">{bookingData.seats.join(', ')}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">Customer:</span>
                    <span className="value">{customerInfo.name}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{customerInfo.email}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">Phone:</span>
                    <span className="value">{customerInfo.phone}</span>
                  </div>
                  
                  <div className="detail-row total">
                    <span className="label">Total Paid:</span>
                    <span className="value total-amount">${bookingData.totalPrice}</span>
                  </div>
                </div>

                <div className="confirmation-actions">
                  <button
                    onClick={printBooking}
                    className="btn btn-outline"
                  >
                    Print Ticket
                  </button>
                  <button
                    onClick={goToMovies}
                    className="btn btn-primary"
                  >
                    Book More Tickets
                  </button>
                </div>

                <div className="confirmation-notes">
                  <h3>Important Notes:</h3>
                  <ul>
                    <li>Please arrive at least 15 minutes before the show time</li>
                    <li>Keep this booking confirmation for entry</li>
                    <li>No refunds or exchanges are allowed</li>
                    <li>Children under 3 years do not require a ticket</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
