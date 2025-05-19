import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../contexts/BookingsContext';
import { useFilms } from '../contexts/FilmsContext';
import { useSessions } from '../contexts/SessionsContext';
import { BookingStatus, PaymentMethod, PaymentStatus } from '../types/movie';
import '../styles/Checkout.css';
import { useTranslation } from 'react-i18next';

interface LocationState {
  bookingId?: string;
  selectedSeats?: { row: number; seat: number }[];
}

const Checkout = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const state = location.state as LocationState;
  const navigate = useNavigate();
  
  const { t } = useTranslation();
  
  const { currentUser, isAuthenticated } = useAuth();
  const { bookings, addBooking, updateBookingStatus } = useBookings();
  const { films } = useFilms();
  const { sessions } = useSessions();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Get session and film details
  const session = sessions.find(s => s.id === sessionId);
  const film = session ? films.find(f => f.id === session.filmId) : null;
  
  // Get booking details if editing an existing booking
  const booking = state?.bookingId 
    ? bookings.find(b => b.id === state.bookingId)
    : null;
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Redirect if no session found
  useEffect(() => {
    if (!session || !film) {
      navigate('/sessions');
    }
  }, [session, film, navigate]);
  
  // Redirect if no booking ID or selected seats
  useEffect(() => {
    if (!state?.bookingId && !state?.selectedSeats) {
      navigate(`/movie/${film?.id}`);
    }
  }, [state, film, navigate]);
  
  // Calculate total price based on the row pricing
  const selectedSeats = state?.selectedSeats || (booking?.seats || []);
  const calculateTotalPrice = (): number => {
    if (!session || !selectedSeats.length) return 0;
    
    return selectedSeats.reduce((total, seat) => {
      // Get price for this specific seat's row
      const rowPrice = session.priceByRow?.[seat.row] || session.price;
      return total + rowPrice;
    }, 0);
  };
  
  // Use the calculated price
  const totalPrice = calculateTotalPrice();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setError('Please fill in all payment fields');
      return;
    }
    
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Invalid card number');
      return;
    }
    
    if (cvv.length !== 3) {
      setError('Invalid CVV');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (booking) {
        // Update existing booking
        updateBookingStatus(booking.id, BookingStatus.PAID);
      } else if (currentUser && session && state?.selectedSeats) {
        // Create new booking
        const newBooking = {
          id: `booking_${Date.now()}`,
          userId: currentUser.id,
          sessionId: session.id,
          seats: state.selectedSeats,
          totalPrice,
          bookingDate: new Date().toISOString(),
          status: BookingStatus.PAID,
          paymentId: `pay_${Date.now()}`
        };
        
        addBooking(newBooking);
      }
      
      // Navigate to success page or bookings
      navigate('/bookings', { 
        state: { 
          paymentSuccess: true,
          filmTitle: film?.title,
          sessionDate: session?.date,
          sessionTime: session?.time
        } 
      });
      
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!currentUser || !session || !film) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <h1>{t('common.checkout')}</h1>
        
        <div className="checkout-summary">
          <div className="film-details">
            <h2>{film.title}</h2>
            <p><strong>{t('common.date')}:</strong> {session.date}</p>
            <p><strong>{t('common.time')}:</strong> {session.time}</p>
            <p><strong>{t('common.hall')}:</strong> {session.hall}</p>
            <p><strong>{t('seats.seat')}:</strong> {selectedSeats.map(seat => `${t('seats.row')} ${seat.row}, ${t('seats.seat')} ${seat.seat}`).join(', ')}</p>
            <p className="total-price"><strong>{t('common.totalPrice')}:</strong> {totalPrice} UAH</p>
          </div>
        </div>
        
        <div className="payment-section">
          <h2>{t('common.paymentDetails')}</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="payment-methods">
              <div className="payment-method-option">
                <input 
                  type="radio" 
                  id="credit-card" 
                  name="payment-method"
                  checked={paymentMethod === PaymentMethod.CREDIT_CARD}
                  onChange={() => setPaymentMethod(PaymentMethod.CREDIT_CARD)}
                />
                <label htmlFor="credit-card">{t('payment.creditCard')}</label>
              </div>
              
              <div className="payment-method-option">
                <input 
                  type="radio" 
                  id="debit-card" 
                  name="payment-method"
                  checked={paymentMethod === PaymentMethod.DEBIT_CARD}
                  onChange={() => setPaymentMethod(PaymentMethod.DEBIT_CARD)}
                />
                <label htmlFor="debit-card">{t('payment.debitCard')}</label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="card-number">{t('payment.cardNumber')}</label>
              <input
                type="text"
                id="card-number"
                value={cardNumber}
                onChange={(e) => {
                  // Format card number with spaces
                  const value = e.target.value.replace(/\s/g, '');
                  if (/^\d*$/.test(value) && value.length <= 16) {
                    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                    setCardNumber(formatted);
                  }
                }}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="card-name">{t('payment.cardholderName')}</label>
              <input
                type="text"
                id="card-name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="expiry-date">{t('payment.expiryDate')}</label>
                <input
                  type="text"
                  id="expiry-date"
                  value={expiryDate}
                  onChange={(e) => {
                    // Format expiry date (MM/YY)
                    const value = e.target.value.replace(/\//g, '');
                    if (/^\d*$/.test(value) && value.length <= 4) {
                      if (value.length > 2) {
                        setExpiryDate(`${value.slice(0, 2)}/${value.slice(2)}`);
                      } else {
                        setExpiryDate(value);
                      }
                    }
                  }}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="cvv">{t('payment.cvv')}</label>
                <input
                  type="text"
                  id="cvv"
                  value={cvv}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 3) {
                      setCvv(value);
                    }
                  }}
                  placeholder="123"
                  maxLength={3}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="pay-button"
              disabled={isProcessing}
            >
              {isProcessing ? t('payment.processing') : `${t('payment.pay')} ${totalPrice} UAH`}
            </button>
          </form>
        </div>
        
        <div className="checkout-actions">
          <button onClick={() => navigate(-1)} className="back-button">
            {t('common.back')}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Checkout; 