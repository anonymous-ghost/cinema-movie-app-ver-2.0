# Cinema Movie App v2.0

## Опис проекту

Cinema Movie App - це сучасний веб-додаток для бронювання квитків у кінотеатрі з функціями перегляду фільмів, вибору сеансів, бронювання місць та отримання підтвердження електронною поштою з QR-кодом.

## Вимоги для запуску

- Node.js (версія 16.x або вище)
- npm або yarn
- Акаунт EmailJS для функціоналу відправки електронних листів

## Встановлення та запуск

1. Клонуйте репозиторій:
   ```bash
   git clone https://github.com/your-username/cinema-movie-app-ver-2.0.git
   cd cinema-movie-app-ver-2.0
   ```

2. Встановіть залежності:
   ```bash
   npm install
   # або
   yarn
   ```

3. Створіть файл `.env` в корені проекту з наступними змінними оточення:
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. Запустіть проект в режимі розробки:
   ```bash
   npm run dev
   # або
   yarn dev
   ```

5. Відкрийте браузер за адресою: `http://localhost:5173`

## Використання QR-кодів

Компонент `QRCodeGenerator` використовується для генерації QR-кодів для квитків. Для його використання:

1. Імпортуйте компонент:
   ```tsx
   import QRCodeGenerator from '@/components/QRCodeGenerator';
   ```

2. Використовуйте компонент у вашому коді:
   ```tsx
   <QRCodeGenerator 
     value="https://example.com/ticket/123456" 
     size={200} 
     bgColor="#FFFFFF" 
     fgColor="black" 
     level="L"
     includeMargin={true}
   />
   ```

### Параметри QRCodeGenerator

| Параметр | Тип | За замовчуванням | Опис |
|---------|------|--------------|-------|
| value | string | (обов'язковий) | Дані для кодування в QR-код |
| size | number | 200 | Розмір QR-коду в пікселях |
| bgColor | string | '#FFFFFF' | Колір фону |
| fgColor | string | 'black' | Колір переднього плану |
| level | string | 'L' | Рівень корекції помилок ('L', 'M', 'Q', 'H') |
| includeMargin | boolean | true | Чи включати відступи |
| imageSettings | object | undefined | Налаштування для вбудованого зображення |

## Налаштування EmailJS для відправки листів

Для правильної роботи відправки електронних листів з QR-кодами:

1. Зареєструйтесь на [EmailJS](https://www.emailjs.com/)
2. Створіть сервіс електронної пошти
3. Створіть шаблон з параметрами:
   - `{{to_email}}` - адреса отримувача
   - `{{customer_name}}` - ім'я клієнта
   - `{{booking_id}}` - ID бронювання
   - `{{film_title}}` - назва фільму
   - `{{session_date}}` - дата сеансу
   - `{{session_time}}` - час сеансу
   - `{{seats}}` - заброньовані місця
   - `{{total_price}}` - загальна вартість
   - `{{qr_code}}` - URL QR-коду

4. Переконайтесь, що в шаблоні EmailJS поле "To Email" використовує змінну `{{to_email}}` для динамічної адреси отримувача

## Технології

- React + TypeScript
- Vite
- React Router
- EmailJS
- QR Code генерація
- i18next для локалізації
