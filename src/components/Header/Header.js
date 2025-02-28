import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll event to add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4C9.373 4 4 9.373 4 16C4 22.627 9.373 28 16 28C22.627 28 28 22.627 28 16C28 9.373 22.627 4 16 4ZM21.6 20.8C21.6 21.24 21.24 21.6 20.8 21.6H11.2C10.76 21.6 10.4 21.24 10.4 20.8V20.4C10.4 19.96 10.76 19.6 11.2 19.6H12V12.4H11.2C10.76 12.4 10.4 12.04 10.4 11.6V11.2C10.4 10.76 10.76 10.4 11.2 10.4H18.4C18.84 10.4 19.2 10.76 19.2 11.2V19.6H20.8C21.24 19.6 21.6 19.96 21.6 20.4V20.8Z" fill="url(#paint0_linear)" />
              <defs>
                <linearGradient id="paint0_linear" x1="4" y1="16" x2="28" y2="16" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#5C6CFF" />
                  <stop offset="1" stopColor="#54C7FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="logo-text">VoiceTranscribe</h1>
        </Link>
        
        <nav className={`nav-menu ${isMobileMenuOpen ? 'nav-menu-open' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/features" className={location.pathname === '/features' ? 'active' : ''}>
                Features
              </Link>
            </li>
            <li>
              <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
                About
              </Link>
            </li>
          </ul>
          
          <div className="nav-actions">
            <a href="#try-now" className="btn btn-primary">Try Now</a>
          </div>
        </nav>
        
        <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;