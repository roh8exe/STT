import React, { useState, useEffect } from 'react';
import AudioRecorder from '../../components/AudioRecorder/AudioRecorder';
import AudioUploader from '../../components/AudioUploader/AudioUploader';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import TranscriptionResult from '../../components/TranscriptResult/TranscriptionResult';
import './Home.css';

const Home = () => {
  const [activeTab, setActiveTab] = useState('record');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState(null);
  const [isAnimated, setIsAnimated] = useState(false);
  
  // Show animation after initial render
  useEffect(() => {
    setTimeout(() => {
      setIsAnimated(true);
    }, 100);
  }, []);

  const handleAudioRecorded = (blob) => {
    setAudioBlob(blob);
    setAudioFile(null);
  };

  const handleAudioUploaded = (file) => {
    setAudioFile(file);
    setAudioBlob(null);
  };

  const handleSourceLanguageChange = (lang) => {
    setSourceLanguage(lang);
  };

  const handleTargetLanguageChange = (lang) => {
    setTargetLanguage(lang);
  };

  const handleTranscribe = () => {
    // This is where you'll integrate your AI model later
    setIsTranscribing(true);
    
    // Mock transcription for UI demonstration
    setTimeout(() => {
      setIsTranscribing(false);
      
      // Sample result
      setTranscriptionResult({
        originalText: "This is a sample transcription of the audio in the original language.",
        translatedText: "This is the translated version of the transcription.",
        confidence: 0.95,
        duration: 12.5
      });
    }, 3000);
  };

  const resetTranscription = () => {
    setAudioBlob(null);
    setAudioFile(null);
    setTranscriptionResult(null);
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className={`hero-content ${isAnimated ? 'animate-fade-in' : ''}`}>
          <h1 className="hero-title">
            <span className="gradient-text">Transcribe & Translate</span> Your Voice
          </h1>
          <p className="hero-subtitle">
            Convert speech to text in any language. Speak, upload, or record —
            our AI will transcribe and translate with professional accuracy.
          </p>
          <div className="hero-actions">
            <a href="#try-now" className="btn btn-primary">
              Start Now
            </a>
            <a href="#features" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
        <div className={`hero-image ${isAnimated ? 'animate-fade-in delay-300' : ''}`}>
          <div className="waveform-animation">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        </div>
      </section>

      <section id="try-now" className="transcription-section">
        <div className="section-header">
          <h2 className="section-title">Try It Now</h2>
          <p className="section-subtitle">
            Start transcribing your speech in three simple steps
          </p>
        </div>

        <div className="transcription-container">
          {!transcriptionResult ? (
            <>
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'record' ? 'active' : ''}`}
                  onClick={() => setActiveTab('record')}
                >
                  <span className="tab-icon">🎙️</span>
                  Record Audio
                </button>
                <button
                  className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
                  onClick={() => setActiveTab('upload')}
                >
                  <span className="tab-icon">📁</span>
                  Upload Audio
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'record' ? (
                  <AudioRecorder onAudioRecorded={handleAudioRecorded} />
                ) : (
                  <AudioUploader onAudioUploaded={handleAudioUploaded} />
                )}
              </div>

              <div className="language-options">
                <div className="language-selection">
                  <h3>Source Language</h3>
                  <LanguageSelector
                    value={sourceLanguage}
                    onChange={handleSourceLanguageChange}
                    includeAuto={true}
                  />
                </div>
                <div className="language-divider">
                  <div className="arrow-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className="language-selection">
                  <h3>Target Language</h3>
                  <LanguageSelector
                    value={targetLanguage}
                    onChange={handleTargetLanguageChange}
                    includeAuto={false}
                  />
                </div>
              </div>

              <div className="action-button">
                <button
                  className="btn btn-primary full-width"
                  onClick={handleTranscribe}
                  disabled={!audioBlob && !audioFile}
                >
                  {isTranscribing ? (
                    <>
                      <span className="loading-spinner"></span>
                      Transcribing...
                    </>
                  ) : (
                    "Transcribe Now"
                  )}
                </button>
              </div>
            </>
          ) : (
            <TranscriptionResult
              result={transcriptionResult}
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              onReset={resetTranscription}
            />
          )}
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">Features</h2>
          <p className="section-subtitle">
            Powerful speech-to-text capabilities at your fingertips
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6.6665C18.3431 6.6665 17 7.98236 17 9.5554V17.2221C17 18.7952 18.3431 20.111 20 20.111C21.6569 20.111 23 18.7952 23 17.2221V9.5554C23 7.98236 21.6569 6.6665 20 6.6665Z" fill="currentColor"/>
                <path d="M26.9999 15.5554C26.9999 15.0033 27.4477 14.5554 27.9999 14.5554C28.5521 14.5554 28.9999 15.0033 28.9999 15.5554V17.2221C28.9999 22.0106 25.1218 25.8888 19.9999 25.8888C14.878 25.8888 10.9999 22.0106 10.9999 17.2221V15.5554C10.9999 15.0033 11.4477 14.5554 11.9999 14.5554C12.552 14.5554 12.9999 15.0033 12.9999 15.5554V17.2221C12.9999 20.9043 16.0948 23.8888 19.9999 23.8888C23.9049 23.8888 26.9999 20.9043 26.9999 17.2221V15.5554Z" fill="currentColor"/>
                <path d="M20 25.8887V31.6665" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M13.3335 31.6665H26.6668" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Real-time Speech Recognition</h3>
            <p>Experience instantaneous transcription as you speak with our cutting-edge speech recognition technology.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3333 8.33325H10C8.15905 8.33325 6.66667 9.82563 6.66667 11.6666V30.0001C6.66667 31.841 8.15905 33.3334 10 33.3334H30C31.8409 33.3334 33.3333 31.841 33.3333 30.0001V26.6666" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M26.6667 8.33325H33.3334V14.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.6667 24.9999L33.3334 8.33325" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Multi-language Support</h3>
            <p>Seamlessly translate between 100+ languages, breaking down communication barriers across the globe.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3333 30H26.6667C30.3486 30 33.3333 27.0152 33.3333 23.3333V16.6667C33.3333 12.9848 30.3486 10 26.6667 10H13.3333C9.65144 10 6.66667 12.9848 6.66667 16.6667V23.3333C6.66667 27.0152 9.65144 30 13.3333 30Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M20 16.6667V23.3334" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M20 16.6667L23.3333 20.0001" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M20 16.6667L16.6667 20.0001" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Audio File Upload</h3>
            <p>Upload pre-recorded audio files in various formats for quick transcription and translation.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6.66675" y="10" width="26.6667" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M13.3333 16.6667L13.3333 23.3334" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M20 16.6667V23.3334" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M26.6667 16.6667V23.3334" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>High Accuracy</h3>
            <p>Our advanced AI model delivers industry-leading accuracy, even with complex accents and terminology.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;