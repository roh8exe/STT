import React, { useState, useEffect } from 'react';
import './Features.css';

const Features = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [activeTab, setActiveTab] = useState('transcription');
  
  useEffect(() => {
    setTimeout(() => {
      setIsAnimated(true);
    }, 100);
  }, []);
  
  return (
    <div className="features-page">
      <section className={`features-hero ${isAnimated ? 'animate-fade-in' : ''}`}>
        <div className="features-hero-content">
          <h1 className="features-title">Advanced <span className="gradient-text">Features</span></h1>
          <p className="features-subtitle">
            Discover the powerful capabilities that make VoiceTranscribe the leading speech-to-text solution
          </p>
        </div>
      </section>
      
      <section className="features-tabs-section">
        <div className="features-tabs">
          <button 
            className={`features-tab ${activeTab === 'transcription' ? 'active' : ''}`}
            onClick={() => setActiveTab('transcription')}
          >
            Speech Recognition
          </button>
          <button 
            className={`features-tab ${activeTab === 'translation' ? 'active' : ''}`}
            onClick={() => setActiveTab('translation')}
          >
            Translation
          </button>
          <button 
            className={`features-tab ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            AI Enhancement
          </button>
          <button 
            className={`features-tab ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            Integrations
          </button>
        </div>
        
        <div className="features-content">
          {activeTab === 'transcription' && (
            <div className={`feature-panel ${isAnimated ? 'animate-fade-in' : ''}`}>
              <div className="feature-header">
                <h2>Advanced Speech Recognition</h2>
                <p>Accurately convert spoken language to text with industry-leading precision</p>
              </div>
              
              <div className="feature-grid">
                <div className="feature-item">
                  <h3>Real-time Processing</h3>
                  <p>Instantly transcribe speech as it's spoken with minimal latency and high accuracy.</p>
                </div>
                
                <div className="feature-item">
                  <h3>Multi-speaker Detection</h3>
                  <p>Automatically differentiate between multiple speakers in conversations and meetings.</p>
                </div>
                
                <div className="feature-item">
                  <h3>Accent Recognition</h3>
                  <p>Accurately transcribe various accents and dialects through our advanced language models.</p>
                </div>
                
                <div className="feature-item">
                  <h3>Specialized Terminology</h3>
                  <p>Support for industry-specific terms and technical vocabularies across multiple domains.</p>
                </div>
                
                <div className="feature-item">
                  <h3>Background Noise Filtering</h3>
                  <p>Advanced algorithms to filter out ambient noise for clear transcriptions even in noisy environments.</p>
                </div>
                
                <div className="feature-item">
                  <h3>Automatic Formatting</h3>
                  <p>Intelligent punctuation and formatting for natural, readable text output.</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'translation' && (
            <div className={`feature-panel ${isAnimated ? 'animate-fade-in' : ''}`}>
              <div className="feature-header">
                <h2>Seamless Translation</h2>
                <p>Break language barriers with high-quality, natural-sounding translations</p>
              </div>
              
              <div className="feature-grid">
                <div className="feature-item">
                  <h3>100+ Languages</h3>
                  <p>Translate between more than 100 languages with high accuracy and natural phrasing.</p>
                </div>
                
                <div className="feature-item">
                  <h3>Context-aware Translation</h3>
                  <p>Our AI understands context and cultural nuances for more accurate and natural translations.</p>
                </div>
                
                <div className="feature-item">
                  <h3>Domain-specific Models</h3>
                  <p>Specialized translation models for legal, medical, technical, and business content.</p>
                </div>
                
                <div className="feature-item">
                  <h3>Instant Language Detection</h3>
                  <p>Automatically detect the source language for faster and more convenient translations.</p>
                </div>
                
                <div className="feature-item">
                  <h3>Batch Translation</h3>
                  <p>Process multiple files or audio sources simultaneously for efficient translation workflows.</p>
                </div>
                
                <div className="feature-item">
                  <h3>Real-time Translation</h3>
                  <p>Translate spoken language on-the-fly for seamless cross-language communication.</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'ai' && (
            <div className={`feature-panel ${isAnimated ? 'animate-fade-in' : ''}`}>
              <div className="feature-header">
                <h2>AI-Powered Enhancement</h2>
                <p>Advanced artificial intelligence that improves quality and usability</p>
              </div>
              
              <div className="feature-grid">
                <div className="feature-item">
                  <h3>Smart Punctuation</h3>
                  <p>Automatically add punctuation and format text for natural, readable transcriptions.</p>
                </div>
                
                <div className="feature-item">
                  <h3>Text Summarization</h3>
                  <p>Generate concise summaries of long transcripts, extracting key information and insights.</p>
                </div>
                
                <div className="feature-item">
                  <h3>Content Organization</h3>
                  <p>Intelligently format and organize transcribed content with headings, paragraphs, and lists.</p>
                </div>
                
                <div className="feature-item">
                  <h3>Sentiment Analysis</h3>
                  <p>Detect emotions and sentiments in speech for deeper insights into conversations.</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'integrations' && (
            <div className={`feature-panel ${isAnimated ? 'animate-fade-in' : ''}`}>
              <div className="feature-header">
                <h2>Seamless Integrations</h2>
                <p>Connect with your favorite tools and platforms for a streamlined workflow</p>
              </div>
              
              <div className="feature-grid">
                <div className="feature-item">
                  <h3>API Access</h3>
                  <p>Integrate our speech-to-text capabilities directly into your applications with our robust API.</p>
                </div>
                
                <div className="feature-item">
                  <h3>Cloud Storage</h3>
                  <p>Connect with Google Drive, Dropbox, OneDrive, and other cloud storage services.</p>
                </div>
                
                <div className="feature-item">
                  <h3>Productivity Apps</h3>
                  <p>Seamless integration with MS Office, Google Workspace, Notion, and other productivity tools.</p>
                </div>
                
                <div className="feature-item">
                  <h3>Video Conferencing</h3>
                  <p>Works with Zoom, Microsoft Teams, Google Meet, and other popular conferencing platforms.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <section className="cta-section">
        <div className={`cta-container ${isAnimated ? 'animate-fade-in' : ''}`}>
          <h2>Ready to experience the future of speech-to-text?</h2>
          <p>Try VoiceTranscribe today and transform how you work with spoken language</p>
          <a href="/#try-now" className="btn btn-primary">Get Started Now</a>
        </div>
      </section>
    </div>
  );
};

export default Features;