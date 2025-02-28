import React, { useEffect, useState } from 'react';
import './About.css';

const About = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  
  useEffect(() => {
    setTimeout(() => {
      setIsAnimated(true);
    }, 100);
  }, []);
  
  return (
    <div className="about-page">
      <section className={`about-hero ${isAnimated ? 'animate-fade-in' : ''}`}>
        <div className="about-hero-content">
          <h1 className="about-title">About <span className="gradient-text">VoiceTranscribe</span></h1>
          <p className="about-subtitle">
            Transforming the way people communicate across languages and borders
          </p>
        </div>
      </section>
      
      <section className="about-section">
        <div className="about-container">
          <div className={`about-image ${isAnimated ? 'animate-fade-in-right delay-300' : ''}`}>
            <div className="image-container">
              <div className="image-overlay"></div>
              <div className="image-content">
                <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4C9.373 4 4 9.373 4 16C4 22.627 9.373 28 16 28C22.627 28 28 22.627 28 16C28 9.373 22.627 4 16 4ZM21.6 20.8C21.6 21.24 21.24 21.6 20.8 21.6H11.2C10.76 21.6 10.4 21.24 10.4 20.8V20.4C10.4 19.96 10.76 19.6 11.2 19.6H12V12.4H11.2C10.76 12.4 10.4 12.04 10.4 11.6V11.2C10.4 10.76 10.76 10.4 11.2 10.4H18.4C18.84 10.4 19.2 10.76 19.2 11.2V19.6H20.8C21.24 19.6 21.6 19.96 21.6 20.4V20.8Z" fill="white" />
                </svg>
              </div>
            </div>
          </div>
          <div className={`about-text ${isAnimated ? 'animate-fade-in-left delay-300' : ''}`}>
            <h2>Our Mission</h2>
            <p>
              At VoiceTranscribe, we're on a mission to break down language barriers and make communication accessible to everyone. We believe that language should never be an obstacle to understanding, learning, or connecting with others.
            </p>
            <p>
              Our state-of-the-art speech-to-text technology harnesses the power of artificial intelligence to accurately transcribe and translate spoken language in real-time, empowering individuals and businesses to communicate effortlessly across different languages.
            </p>
          </div>
        </div>
      </section>
      
      <section className="values-section">
        <div className="section-header">
          <h2 className="section-title">Our Values</h2>
          <p className="section-subtitle">
            The principles that guide everything we do
          </p>
        </div>
        
        <div className="values-grid">
          <div className={`value-card ${isAnimated ? 'animate-fade-in-up delay-400' : ''}`}>
            <div className="value-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12H4M12 3V4M20 12H21M12 20V21M5.6 5.6L6.3 6.3M18.4 5.6L17.7 6.3M5.6 18.4L6.3 17.7M18.4 18.4L17.7 17.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Innovation</h3>
            <p>We continuously push the boundaries of what's possible, developing advanced AI solutions that make speech recognition and translation more accurate and accessible.</p>
          </div>
          
          <div className={`value-card ${isAnimated ? 'animate-fade-in-up delay-500' : ''}`}>
            <div className="value-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Inclusivity</h3>
            <p>We believe in making our technology available to as many people as possible, regardless of language, background, or technical ability.</p>
          </div>
          
          <div className={`value-card ${isAnimated ? 'animate-fade-in-up delay-600' : ''}`}>
            <div className="value-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7.5L10 9.5L13 7.5L16 9.5L19 7.5V17.5L16 19.5L13 17.5L10 19.5L7 17.5V7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9.5V19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 7.5V17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 9.5V19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Accuracy</h3>
            <p>We strive for precision in every transcription and translation, ensuring that the nuance and intent of the original speech is preserved.</p>
          </div>
          
          <div className={`value-card ${isAnimated ? 'animate-fade-in-up delay-700' : ''}`}>
            <div className="value-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 12C19.333 16.667 16 19 12 19C8 19 4.667 16.667 2 12C4.667 7.333 8 5 12 5C16 5 19.333 7.333 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Privacy</h3>
            <p>We respect user privacy and are committed to protecting sensitive information with robust security measures and transparent data practices.</p>
          </div>
        </div>
      </section>
      
      <section className="team-section">
        <div className="section-header">
          <h2 className="section-title">Our Team</h2>
          <p className="section-subtitle">
            Meet the passionate experts behind VoiceTranscribe
          </p>
        </div>
        
        <div className="team-grid">
          <div className={`team-member ${isAnimated ? 'animate-fade-in-up delay-400' : ''}`}>
            <div className="member-photo member-photo-1"></div>
            <h3></h3>
            <p className="member-title"></p>
            <p className="member-bio"></p>
          </div>
          
          <div className={`team-member ${isAnimated ? 'animate-fade-in-up delay-500' : ''}`}>
            <div className="member-photo member-photo-2"></div>
            <h3></h3>
            <p className="member-title"></p>
            <p className="member-bio"></p>
          </div>
          
          <div className={`team-member ${isAnimated ? 'animate-fade-in-up delay-600' : ''}`}>
            <div className="member-photo member-photo-3"></div>
            <h3></h3>
            <p className="member-title"></p>
            <p className="member-bio"></p>
          </div>
          
          <div className={`team-member ${isAnimated ? 'animate-fade-in-up delay-700' : ''}`}>
            <div className="member-photo member-photo-4"></div>
            <h3></h3>
            <p className="member-title"></p>
            <p className="member-bio"></p>
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <div className={`cta-container ${isAnimated ? 'animate-fade-in-up delay-300' : ''}`}>
          <h2>Ready to break language barriers?</h2>
          <p>Experience the future of speech-to-text technology today</p>
          <a href="/#try-now" className="btn btn-primary">Try It Now</a>
        </div>
      </section>
    </div>
  );
};

export default About;