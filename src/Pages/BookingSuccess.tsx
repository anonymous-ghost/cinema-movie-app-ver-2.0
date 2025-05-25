import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import '../styles/BookingSuccess.css';

const BookingSuccess = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, emailSent } = location.state || {};

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-[#0F1117] text-white p-4">
      <div className="success-card max-w-md w-full bg-[#1A1C24] border border-[#2A2C34] rounded-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
        <div className="mb-6">
          <CheckCircle className="success-icon w-20 h-20 text-green-500 mx-auto" />
        </div>
        
        <h1 className="gradient-text text-3xl font-bold mb-6">
          {t('booking.bookingSuccess')}
        </h1>

        <div className="space-y-4 mb-8">
          <p className="text-gray-400 text-lg">
            {t('booking.bookingId')}:
            <span className="block text-white font-medium mt-1">{bookingId}</span>
          </p>

          {emailSent && (
            <p className="text-gray-400 text-lg">
              {t('payment.confirmationSent')}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/bookings')} 
            className="success-button w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-3"
          >
            {t('booking.viewBookings')}
          </Button>

          <Button 
            variant="secondary" 
            onClick={() => navigate('/')} 
            className="success-button w-full border-2 border-gray-700 hover:border-gray-600 text-lg py-3"
          >
            {t('common.backToHome')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
