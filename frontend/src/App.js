import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
// 👇 IMPORT PROTECTED ROUTE
import ProtectedRoute from './components/ProtectedRoute'; 
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HistoryPage from './pages/HistoryPage'; 
import { AuthProvider } from './context/AuthContext';

const App = () => {
  // A simple Home/Welcome component for the root path
  const HomePage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
      navigate('/login');
    };

    return (
      <Container
        className="mt-5 text-center"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          color: 'white',
          padding: '50px',
          marginTop: '20px'
        }}
      >
        <h1
          style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            marginBottom: '20px',
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          Welcome to Doc Search Hub
        </h1>
        <p
          style={{
            fontSize: '1.3rem',
            opacity: '0.9',
            maxWidth: '600px',
            lineHeight: '1.6',
            fontFamily: "'Roboto', sans-serif"
          }}
        >
          Please log in or register to upload documents and start chatting.
        </p>
        <div
          style={{
            marginTop: '30px',
            display: 'flex',
            gap: '20px'
          }}
        >
          <button
            onClick={handleGetStarted}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid white',
              color: 'white',
              padding: '12px 30px',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            Get Started
          </button>
        </div>
      </Container>
    );
  };
  
  return (
    <Router>
      <AuthProvider>
        <Header />
        <main className="py-3">
          <Routes>
            <Route path="/" element={<HomePage />} exact />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 👇 PROTECTED ROUTES GROUP */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Route>
            {/* 👆 END PROTECTED ROUTES GROUP */}
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
};

export default App;