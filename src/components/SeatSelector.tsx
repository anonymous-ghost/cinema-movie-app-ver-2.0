import React from 'react';
import '../styles/SeatSelector.css';
import { Session } from '../types';
import { useTranslation } from 'react-i18next';

interface SeatSelectorProps {
  onClose: () => void;
  onConfirm: (selectedSeats: number[]) => void;
  session: Session;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({ onClose, onConfirm, session }) => {
  const { t } = useTranslation();
  const [selectedSeats, setSelectedSeats] = React.useState<number[]>([]);

  const handleSeatClick = (row: number, seat: number) => {
    const seatNumber = row * 8 + seat;
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedSeats);
    onClose();
  };

  // Get seat price based on row
  const getSeatPrice = (row: number): number => {
    return session.priceByRow?.[row + 1] || session.price;
  };

  // Calculate total price for selected seats
  const calculateTotalPrice = (): number => {
    return selectedSeats.reduce((total, seatNumber) => {
      const row = Math.floor(seatNumber / 8);
      return total + getSeatPrice(row);
    }, 0);
  };

  return (
    <div className="seat-selector-overlay">
      <div className="seat-selector-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>{t('seats.selectSeat')}</h2>
        <div className="screen">{t('common.screen')}</div>
        <div className="seats-container">
          {Array.from({ length: 5 }, (_, row) => (
            <div key={row} className="seat-row">
              <span className="row-number">{row + 1}</span>
              <div className="row-price">{getSeatPrice(row)} UAH</div>
              {Array.from({ length: 8 }, (_, seat) => {
                const seatNumber = row * 8 + seat;
                const isSelected = selectedSeats.includes(seatNumber);
                const isOccupied = Math.random() < 0.3; // Random occupied seats for demo

                return (
                  <button
                    key={seat}
                    className={`seat ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
                    onClick={() => !isOccupied && handleSeatClick(row, seat)}
                    disabled={isOccupied}
                  >
                    {seat + 1}
                  </button>
                );
              })}
              <span className="row-number">{row + 1}</span>
            </div>
          ))}
        </div>
        <div className="legend">
          <div className="legend-item">
            <div className="seat-example available"></div>
            <span>{t('common.available')}</span>
          </div>
          <div className="legend-item">
            <div className="seat-example selected"></div>
            <span>{t('common.selected')}</span>
          </div>
          <div className="legend-item">
            <div className="seat-example occupied"></div>
            <span>{t('common.occupied')}</span>
          </div>
        </div>
        
        {selectedSeats.length > 0 && (
          <div className="price-summary">
            <p>{t('common.selectedSeats')}: {selectedSeats.length}</p>
            <p className="total-price">{t('common.totalPrice')}: {calculateTotalPrice()} UAH</p>
          </div>
        )}
        
        <button 
          className="confirm-button" 
          onClick={handleConfirm}
          disabled={selectedSeats.length === 0}
        >
          {t('common.confirm')}
        </button>
      </div>
    </div>
  );
};

export default SeatSelector;