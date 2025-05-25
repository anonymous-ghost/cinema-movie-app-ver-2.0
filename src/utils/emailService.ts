import emailjs from '@emailjs/browser';

// EmailJS credentials from environment variables
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export interface BookingDetails {
  id: string;
  filmTitle: string;
  sessionDate: string;
  sessionTime: string;
  seats: { row: number; seat: number }[];
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  cardNumber: string; // Last 4 digits only
}

/**
 * Generates a QR code as a data URL for a booking
 * @param booking The booking details to encode in the QR code
 * @returns Promise resolving to a data URL string
 */
export const generateQRCode = async (booking: BookingDetails): Promise<string> => {
  try {
    // Create a unique identifier for this booking
    const uniqueId = `${booking.id}-${new Date().getTime()}`;
    
    // Generate static QR code URL with the booking ID
    // This will be different for each booking but simple enough to display correctly
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${uniqueId}&format=png`;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

/**
 * Sends a booking confirmation email with QR code
 * @param booking The booking details
 * @param qrCodeDataUrl The generated QR code as a data URL
 * @returns Promise resolving when email is sent
 */
export async function sendBookingConfirmation(bookingDetails: BookingDetails, qrCodeUrl: string): Promise<void> {
  try {
    // Format seats with Ukrainian text
    const formattedSeats = bookingDetails.seats
      .map((seat: { row: number; seat: number }) => 
        `Ряд ${seat.row}, Місце ${seat.seat}`
      )
      .join(', ');

    const templateParams = {
      to_email: bookingDetails.customerEmail,
      customer_name: bookingDetails.customerName,
      customer_email: bookingDetails.customerEmail,
      booking_id: bookingDetails.id,
      film_title: bookingDetails.filmTitle,
      session_date: bookingDetails.sessionDate,
      session_time: bookingDetails.sessionTime,
      seats: formattedSeats,
      total_price: `${bookingDetails.totalPrice} UAH`,
      card_number: bookingDetails.cardNumber,
      qr_code: qrCodeUrl,
      template_style: `
        background-color: #0F1117;
        color: #ffffff;
        font-family: Arial, sans-serif;
      `,
      gradient_title: `
        background: linear-gradient(90deg, #3B82F6 0%, #9333EA 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      `,
      accent_color: '#3B82F6',
      border_color: '#2A2C34',
      bg_dark: '#1A1C24'
    };

    // Send email
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    throw error;
  }
};
