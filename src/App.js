import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Features from './pages/Features/Features';
import AnimatedBackground from './components/AnimatedBackground/AnimatedBackground';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for smooth intro animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="app">
        {loading ? (
          <div className="loading-screen">
            <div className="logo-container">
              <h1 className="logo-text">VoiceTranscribe</h1>
              <div className="loading-bar">
                <div className="loading-progress"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <AnimatedBackground />
            <div className="content-wrapper">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/features" element={<Features />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;