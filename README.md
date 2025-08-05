# MSK Travels - Full Stack Travel Booking Website

A complete travel booking platform built with React frontend and Django backend.

## 🚀 Features

### Frontend (React)
- **Landing Page**: Direct booking form with location and date inputs
- **Package Catalog**: Display available travel packages
- **Booking System**: Direct booking with email/WhatsApp notifications
- **About & Contact Pages**: Company information and contact form
- **Responsive Design**: Built with Tailwind CSS

### Backend (Django REST Framework)
- **RESTful API**: Direct booking, contact, and notification endpoints
- **Email & WhatsApp Integration**: Automatic notifications for bookings and contact messages
- **Admin Interface**: Manage vehicles, bookings, and messages
- **CORS Support**: Cross-origin requests for React frontend
- **Database Models**: Vehicles, Bookings, Contact Messages

## 📁 Project Structure

```
travels_webpage/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Django application
│   ├── msk_travels/
│   │   ├── api/
│   │   ├── bookings/
│   │   ├── vehicles/
│   │   ├── contact/
│   │   └── manage.py
│   ├── requirements.txt
│   └── .env
└── README.md
```

## 🛠️ Setup Instructions

### Backend Setup (Django)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start Django server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (React)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start React development server:**
   ```bash
   npm start
   ```

## 🌐 API Endpoints

- `POST /api/direct-book/` - Create a direct booking with email/WhatsApp notifications
- `POST /api/book/` - Create a new booking (legacy)
- `POST /api/contact/` - Submit contact form with email/WhatsApp notifications

## 🎨 Technologies Used

- **Frontend**: React, Tailwind CSS, React Router, Axios, React DatePicker
- **Backend**: Django, Django REST Framework, Django CORS Headers
- **Database**: SQLite (development), PostgreSQL (production ready)

## 📱 Usage

1. Open http://localhost:3000 for the React frontend
2. Open http://localhost:8000/admin for Django admin interface
3. Use the booking form to submit booking requests (sends email/WhatsApp notifications)
4. Contact form also sends email/WhatsApp notifications

## 📧 Email & WhatsApp Setup

See `backend/EMAIL_SETUP.md` for detailed instructions on configuring email and WhatsApp notifications.

## 🔧 Development

- Backend runs on http://localhost:8000
- Frontend runs on http://localhost:3000
- CORS is configured to allow frontend-backend communication 