/**
 * Утиліта для генерації статичних QR-кодів
 * Ця функція повертає URL до статичного QR-коду, який можна використовувати в шаблонах EmailJS
 */

/**
 * Генерує URL для статичного QR-коду з фіксованими даними
 * @param bookingId ID бронювання для включення в QR-код
 * @returns URL до статичного QR-коду
 */
export const generateStaticQRCode = (bookingId: string): string => {
  // Створюємо простий рядок даних з ID бронювання
  const qrData = `ID:${bookingId}`;
  
  // Кодуємо дані для URL
  const encodedData = encodeURIComponent(qrData);
  
  // Використовуємо Google Chart API для генерації QR-коду
  // Цей URL можна використовувати безпосередньо в шаблоні EmailJS
  return `https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${encodedData}`;
};

/**
 * Повертає URL до попередньо згенерованого статичного QR-коду
 * Використовуйте цю функцію, якщо у вас є проблеми з динамічними QR-кодами в EmailJS
 * @returns URL до статичного QR-коду
 */
export const getStaticQRCodeUrl = (): string => {
  // Повертаємо URL до статичного QR-коду
  // Цей QR-код містить фіксований текст "Cinema Ticket"
  return "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=Cinema%20Ticket";
};

/**
 * Генерує HTML для вставки QR-коду в шаблон EmailJS
 * @param bookingId ID бронювання
 * @returns HTML код для вставки в шаблон
 */
export const getQRCodeHtml = (bookingId: string): string => {
  const qrCodeUrl = generateStaticQRCode(bookingId);
  
  return `
    <div style="text-align: center; margin: 30px 0;">
      <p style="color: #ffffff; margin-bottom: 15px;">Ваш QR-код квитка:</p>
      <div style="background: #ffffff; display: inline-block; padding: 15px; border-radius: 10px;">
        <img 
          src="${qrCodeUrl}" 
          alt="QR-код квитка" 
          style="width: 150px; height: 150px; display: block; margin: 0;"
        >
      </div>
    </div>
  `;
};
