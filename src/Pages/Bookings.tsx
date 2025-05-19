import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../contexts/BookingsContext';
import { useFilms } from '../contexts/FilmsContext';
import { useSessions } from '../contexts/SessionsContext';
import { Booking, BookingStatus } from '../types/movie';
import '../styles/Bookings.css';
import { useTranslation } from 'react-i18next';

const Bookings = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { getUserBookings, updateBookingStatus } = useBookings();
  const { films } = useFilms();
  const { sessions } = useSessions();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Load user bookings
  useEffect(() => {
    if (currentUser) {
      const bookings = getUserBookings(currentUser.id);
      setUserBookings(bookings);
    }
  }, [currentUser, getUserBookings]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get film and session details
  const getBookingDetails = (booking: Booking) => {
    const session = sessions.find(s => s.id === booking.sessionId.toString());
    const film = session ? films.find(f => f.id === session.filmId) : null;
    
    return { film, session };
  };
  
  // Format date for debugging
  const formatDateForDebug = (date: Date) => {
    return date.toISOString();
  };

  // Filter bookings based on active tab
  const filteredBookings = userBookings.filter(booking => {
    const { session } = getBookingDetails(booking);
    
    if (!session) return false;
    
    // Skip cancelled bookings entirely
    if (booking.status === BookingStatus.CANCELLED) return false;
    
    // For debugging
    console.log(`Booking ${booking.id} - Status: ${booking.status}`);
    
    if (activeTab === 'upcoming') {
      // Upcoming tab: ONLY show RESERVED status bookings
      return booking.status === BookingStatus.RESERVED;
    } else {
      // Past tab: ONLY show PAID status bookings
      return booking.status === BookingStatus.PAID;
    }
  });
  
  // Cancel booking
  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm(t('booking.confirmCancellation'))) {
      updateBookingStatus(bookingId, BookingStatus.CANCELLED);
      // Refresh bookings
      if (currentUser) {
        const bookings = getUserBookings(currentUser.id);
        setUserBookings(bookings);
      }
    }
  };
  
  if (!currentUser) {
    return null; // Will redirect to login via useEffect
  }
  
  return (
    <main className="bookings-page">
      <div className="bookings-container">
        <h1>{t('booking.myBookings')}</h1>
        
        <div className="bookings-tabs">
          <button 
            className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            {t('booking.upcomingBookings')}
          </button>
          <button 
            className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            {t('booking.historyBookings')}
          </button>
        </div>
        
        {filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <p>{t('booking.noBookings')}</p>
            <button 
              onClick={() => navigate('/sessions')}
              className="browse-sessions-btn"
            >
              {t('headerMenu.sessions')}
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map(booking => {
              const { film, session } = getBookingDetails(booking);
              
              if (!film || !session) return null;
              
              return (
                <div key={booking.id} className="booking-card">
                  <div className="booking-image">
                    {film.posterUrl && <img src={film.posterUrl} alt={film.title} />}
                  </div>
                  
                  <div className="booking-details">
                    <h3>{film.title}</h3>
                    
                    <div className="booking-info">
                      <p><strong>{t('common.date')}:</strong> {session.date}</p>
                      <p><strong>{t('common.time')}:</strong> {session.time}</p>
                      <p><strong>{t('common.hall')}:</strong> {session.hall}</p>
                      <p><strong>{t('seats.seat')}:</strong> {booking.seats.map(seat => `${t('seats.row')} ${seat.row}, ${t('seats.seat')} ${seat.seat}`).join('; ')}</p>
                      <p><strong>{t('common.totalPrice')}:</strong> {booking.totalPrice} UAH</p>
                      <p><strong>{t('booking.bookingDate')}:</strong> {formatDate(booking.bookingDate)}</p>
                      <p><strong>{t('booking.status')}:</strong> <span className={`status-${booking.status}`}>{t(`booking.${booking.status.toLowerCase()}`)}</span></p>
                    </div>
                    
                    {booking.status === BookingStatus.RESERVED && (
                      <div className="booking-actions">
                        <button 
                          onClick={() => navigate(`/checkout/${session.id}`, { 
                            state: { bookingId: booking.id } 
                          })}
                          className="pay-button"
                        >
                          {t('common.payNow')}
                        </button>
                        <button 
                          onClick={() => handleCancelBooking(booking.id)}
                          className="cancel-button"
                        >
                          {t('booking.cancelBooking')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Bookings; 