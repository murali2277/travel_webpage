  import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import BookingConfirmation from './pages/BookingConfirmation';
import Login from './components/Login';
import Register from './components/Register';
import { logoutUser } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Fetch CSRF token on app start
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        await fetch('http://localhost:8000/api/csrf-token/', {
          method: 'GET',
          credentials: 'include',
        });
      } catch (error) {
        console.log('CSRF token fetch error:', error);
      }
    };

    fetchCSRFToken();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleRegister = (data) => {
    // After successful registration, show login
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  const handleShowLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar
          user={user}
          onLogout={handleLogout}
          onShowLogin={handleShowLogin}
          onShowRegister={handleShowRegister}
        />

        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home user={user} onShowLogin={handleShowLogin} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact user={user} onShowLogin={handleShowLogin} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          </Routes>
        </main>

        <Footer />

        {/* Authentication Modals */}
        {showLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <button
                  onClick={() => setShowLogin(false)}
                  className="float-right text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <Login
                  onLogin={handleLogin}
                  onSwitchToRegister={handleShowRegister}
                />
              </div>
            </div>
          </div>
        )}

        {showRegister && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <button
                  onClick={() => setShowRegister(false)}
                  className="float-right text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <Register
                  onRegister={handleRegister}
                  onSwitchToLogin={handleShowLogin}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
