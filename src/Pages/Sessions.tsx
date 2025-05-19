import { useState } from "react";
import "../styles/Sessions.css";
import SeatSelector from "../components/SeatSelector";
import { useFilms } from "../contexts/FilmsContext";
import { useSessions } from "../contexts/SessionsContext";
import { Session as SessionType } from "../types";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { BookingStatus } from "../types/movie";
import { useBookings } from "../contexts/BookingsContext";
import { useTranslation } from "react-i18next";

// Повний список жанрів
const ALL_GENRES = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", 
  "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", 
  "Magic", "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"
];

const Sessions = () => {
  const [dateFilter, setDateFilter] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<string>("");
  const [genreFilter, setGenreFilter] = useState<string>("");
  const [showSeatSelector, setShowSeatSelector] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [showBookingOptions, setShowBookingOptions] = useState(false);
  const [processedSeats, setProcessedSeats] = useState<{row: number, seat: number}[]>([]);

  const { t } = useTranslation();

  // Get data from contexts
  const { films } = useFilms();
  const { sessions } = useSessions();
  const { isAuthenticated, currentUser } = useAuth();
  const { addBooking } = useBookings();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter sessions based on selected filters
  const filteredSessions = sessions.filter((session) => {
    const film = films.find(f => f.id === session.filmId);
    if (!film) return false;
    
    const matchesDate = dateFilter ? session.date === dateFilter : true;
    const matchesTime = timeFilter
      ? session.time.startsWith(timeFilter)
      : true;
    const matchesGenre = genreFilter
      ? film.genres.includes(genreFilter)
      : true;

    return matchesDate && matchesTime && matchesGenre;
  });

  // Get unique options for filters
  const dates = [...new Set(sessions.map((session) => session.date))].sort();
  const times = [...new Set(sessions.map((session) => session.time.split(":")[0]))].sort();
  
  // Використовуємо всі жанри + ті, що є у фільмах (на випадок, якщо є якісь додаткові)
  const usedGenres = [...new Set(films.flatMap(film => film.genres))];
  const allGenres = [...new Set([...ALL_GENRES, ...usedGenres])].sort();

  // Format date for display
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
  };

  // Handle seat selection confirmation
  const handleConfirmSeats = (seatNumbers: number[]) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({ 
        title: t('auth.authRequired'), 
        description: t('auth.loginToContinue'), 
        variant: "destructive" 
      });
      navigate('/login');
      return;
    }
    
    if (!selectedSession) {
      toast({ title: "No session selected", variant: "destructive" });
      return;
    }
    
    // Convert seat numbers to row/seat format
    const seats = seatNumbers.map(seatNumber => {
      const row = Math.floor(seatNumber / 8) + 1;
      const seat = seatNumber % 8 + 1;
      return { row, seat };
    });
    
    // Store the processed seats for later use
    setProcessedSeats(seats);
    
    // Show booking options modal
    setShowBookingOptions(true);
    setShowSeatSelector(false);
  };
  
  // Handle "Pay Now" option
  const handlePayNow = () => {
    if (!selectedSession) return;
    
    // Navigate to checkout with selected session and seats
    navigate(`/checkout/${selectedSession.id}`, {
      state: { selectedSeats: processedSeats }
    });
    
    setShowBookingOptions(false);
  };
  
  // Handle "Add to Upcoming Bookings" option
  const handleAddToUpcoming = () => {
    if (!selectedSession || !currentUser) return;
    
    // Calculate total price
    const totalPrice = processedSeats.reduce((total, seat) => {
      const rowPrice = selectedSession.priceByRow?.[seat.row] || selectedSession.price;
      return total + rowPrice;
    }, 0);
    
    // Create a new booking with RESERVED status
    const newBooking = {
      id: `booking_${Date.now()}`,
      userId: currentUser.id,
      sessionId: selectedSession.id,
      seats: processedSeats,
      totalPrice,
      bookingDate: new Date().toISOString(),
      status: BookingStatus.RESERVED
    };
    
    // Add the booking
    addBooking(newBooking);
    
    // Show success message
    toast({ 
      title: t('booking.bookingAdded'), 
      description: t('booking.addedToBookings') 
    });
    
    // Navigate to bookings page
    navigate('/bookings');
    
    setShowBookingOptions(false);
  };

  // Calendar icon SVG
  const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#e50914" viewBox="0 0 16 16">
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
    </svg>
  );

  // Clock icon SVG
  const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#e50914" viewBox="0 0 16 16">
      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
    </svg>
  );

  // Tag icon SVG
  const TagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#e50914" viewBox="0 0 16 16">
      <path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"/>
      <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
    </svg>
  );

  // Location icon SVG
  const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#e50914" viewBox="0 0 16 16">
      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
    </svg>
  );

  return (
    <main className="sessions-page">
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="main-text" style={{ textAlign: "center" }}>
          <h1 className="text-netflix">{t('sessions.cinemaSessions')}</h1>
          <h3 className="text-current">{t('sessions.viewAndFilter')}</h3>
        </div>
        
        <div className="pricing-info" style={{ 
            margin: "20px auto", 
            padding: "15px", 
            backgroundColor: "rgba(229, 9, 20, 0.05)", 
            borderRadius: "8px",
            maxWidth: "800px",
            textAlign: "center" 
          }}>
          <h3 style={{ color: "#e50914", marginBottom: "10px" }}>{t('pricing.premiumSeating')}</h3>
          <p>{t('pricing.updatedPrices')}</p>
          <div className="price-table" style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: "10px",
              flexWrap: "wrap", 
              margin: "10px 0"
            }}>
            <div className="price-item" style={{ 
                padding: "8px 12px", 
                backgroundColor: "rgba(229, 9, 20, 0.1)", 
                borderRadius: "4px" 
              }}>
              <strong>Row 1:</strong> 600 UAH
            </div>
            <div className="price-item" style={{ 
                padding: "8px 12px", 
                backgroundColor: "rgba(229, 9, 20, 0.1)", 
                borderRadius: "4px" 
              }}>
              <strong>Row 2:</strong> 500 UAH
            </div>
            <div className="price-item" style={{ 
                padding: "8px 12px", 
                backgroundColor: "rgba(229, 9, 20, 0.1)", 
                borderRadius: "4px" 
              }}>
              <strong>Row 3:</strong> 400 UAH
            </div>
            <div className="price-item" style={{ 
                padding: "8px 12px", 
                backgroundColor: "rgba(229, 9, 20, 0.1)", 
                borderRadius: "4px" 
              }}>
              <strong>Row 4:</strong> 300 UAH
            </div>
            <div className="price-item" style={{ 
                padding: "8px 12px", 
                backgroundColor: "rgba(229, 9, 20, 0.1)", 
                borderRadius: "4px" 
              }}>
              <strong>Row 5:</strong> 200 UAH
            </div>
          </div>
        </div>

        <div className="filter-container" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "15px" }}>
          <div className="filter-group">
            <label>{t('common.date')}:</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="">{t('common.allDates')}</option>
              {dates.map((date) => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>{t('common.time')}:</label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="">{t('common.allTimes')}</option>
              {times.map((time) => (
                <option key={time} value={time}>
                  {time}:00
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>{t('common.genre')}:</label>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              style={{ minWidth: "150px" }}
            >
              <option value="">{t('common.allGenres')}</option>
              {allGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <button
            className="reset-button"
            onClick={() => {
              setDateFilter("");
              setTimeFilter("");
              setGenreFilter("");
            }}
          >
            {t('common.resetFilters')}
          </button>
        </div>

        <div style={{ margin: "20px 0", textAlign: "center" }}>
          <p>{t('sessions.showing', { count: filteredSessions.length, total: sessions.length })}</p>
        </div>

        <div className="sessions-list" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => {
              const film = films.find(f => f.id === session.filmId);
              if (!film) return null;
              
              return (
                <div key={session.id} className="session-card" style={{ width: "100%", maxWidth: "800px" }}>
                  <div className="session-image">
                    <img src={film.posterUrl} alt={film.title} />
                  </div>
                  <div className="session-details">
                    <h3 className="movie-title">
                      <Link to={`/movie/${film.id}`}>{film.title}</Link>
                    </h3>
                    <div className="session-info">
                      <p>
                        <CalendarIcon /> {formatDate(session.date)}
                      </p>
                      <p>
                        <ClockIcon /> {session.time}
                      </p>
                      <p>
                        <TagIcon /> {film.genres.join(', ')}
                      </p>
                      <p>
                        <LocationIcon /> {session.hall}
                      </p>
                    </div>
                    <div className="session-actions">
                      <button
                        className="book-button"
                        onClick={() => {
                          setSelectedSession(session);
                          setShowSeatSelector(true);
                        }}
                      >
                        {t('common.bookTickets')}
                      </button>
                      <span className="price">{session.price} UAH</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-sessions" style={{ textAlign: "center" }}>
              <p>{t('common.noSessions')}</p>
              <button
                className="reset-button"
                onClick={() => {
                  setDateFilter("");
                  setTimeFilter("");
                  setGenreFilter("");
                }}
              >
                {t('common.resetFilters')}
              </button>
            </div>
          )}
        </div>
      </div>

      {showSeatSelector && selectedSession && (
        <SeatSelector 
          onClose={() => setShowSeatSelector(false)} 
          onConfirm={handleConfirmSeats} 
          session={selectedSession}
        />
      )}
      
      {showBookingOptions && (
        <div className="booking-options-overlay">
          <div className="booking-options-modal">
            <button className="close-button" onClick={() => setShowBookingOptions(false)}>×</button>
            <h2>{t('booking.bookingOptions')}</h2>
            <p>{t('booking.howContinue')}</p>
            <div className="booking-options-buttons">
              <button className="option-button pay-now" onClick={handlePayNow}>
                {t('common.payNow')}
              </button>
              <button className="option-button add-to-upcoming" onClick={handleAddToUpcoming}>
                {t('common.saveForLater')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Sessions;