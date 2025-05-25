import emailjs from '@emailjs/browser';
import { generateStaticQRCode, getStaticQRCodeUrl } from './staticQRCode';

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
    // Створюємо спрощений рядок з даними для QR-коду (зменшуємо довжину)
    // Використовуємо тільки ID бронювання, щоб зменшити довжину URL
    const qrData = `ID:${booking.id}`;
    
    // Кодуємо дані для уникнення проблем з URL
    const encodedData = encodeURIComponent(qrData);
    
    // Використовуємо простіший URL для QR-коду
    return `https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${encodedData}`;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

/**
 * Sends a booking confirmation email with QR code
 * @param booking The booking details
 * @param qrCodeDataUrl The generated QR code as a data URL (optional, will use static QR if not provided)
 * @returns Promise resolving when email is sent
 */
export async function sendBookingConfirmation(bookingDetails: BookingDetails, qrCodeUrl?: string): Promise<void> {
  try {
    // Format seats with Ukrainian text
    const formattedSeats = bookingDetails.seats
      .map((seat: { row: number; seat: number }) => 
        `Ряд ${seat.row}, Місце ${seat.seat}`
      )
      .join(', ');

    // Використовуємо статичний QR-код, якщо динамічний не передано або виникли проблеми
    const staticQrCodeUrl = generateStaticQRCode(bookingDetails.id);
    const finalQrCodeUrl = qrCodeUrl || staticQrCodeUrl;

    const templateParams = {
      // Використовуємо тільки to_email для отримувача, не змінюємо from_email
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
      // Використовуємо статичний QR-код
      qr_code: finalQrCodeUrl,
      // Спрощуємо стилі для зменшення розміру запиту
      template_style: 'background-color: #0F1117; color: #ffffff; font-family: Arial, sans-serif;',
      gradient_title: 'background: linear-gradient(90deg, #3B82F6 0%, #9333EA 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;',
      accent_color: '#3B82F6',
      border_color: '#2A2C34',
      bg_dark: '#1A1C24'
    };

    // Додаємо затримку перед відправкою для уникнення обмежень API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Відправляємо email з обробкою помилок
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      console.log('Email sent successfully to:', bookingDetails.customerEmail);
    } catch (emailError: any) {
      // Виводимо детальну інформацію про помилку
      console.error('EmailJS error details:', {
        status: emailError.status,
        text: emailError.text,
        serviceId: SERVICE_ID,
        templateId: TEMPLATE_ID
      });
      throw emailError;
    }
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    throw error;
  }
};
