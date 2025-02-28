import React, { useState, useRef } from 'react';
import './TranscriptionResult.css';

const TranscriptionResult = ({ result, sourceLanguage, targetLanguage, onReset }) => {
  const [activeTab, setActiveTab] = useState('translated');
  const [isCopied, setIsCopied] = useState(false);
  const textRef = useRef(null);
  
  // Format language codes to readable names
  const getLanguageName = (code) => {
    const languages = {
      'auto': 'Auto-detected',
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'bn': 'Bengali',
      'id': 'Indonesian',
      'ms': 'Malay',
      'th': 'Thai',
      'vi': 'Vietnamese',
      'nl': 'Dutch',
      'pl': 'Polish',
      'tr': 'Turkish'
    };
    
    return languages[code] || code;
  };
  
  const handleCopyText = () => {
    if (!textRef.current) return;
    
    const textToCopy = activeTab === 'translated' 
      ? result.translatedText 
      : result.originalText;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  
  const formatAccuracy = (confidence) => {
    return (confidence * 100).toFixed(1) + '%';
  };
  
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  return (
    <div className="transcription-result">
      <div className="result-header">
        <h3>Transcription Complete</h3>
        <div className="result-stats">
          <div className="stat">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{formatAccuracy(result.confidence)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Duration</span>
            <span className="stat-value">{formatDuration(result.duration)}</span>
          </div>
        </div>
      </div>
      
      <div className="result-tabs">
        <button 
          className={`result-tab ${activeTab === 'translated' ? 'active' : ''}`}
          onClick={() => setActiveTab('translated')}
        >
          Translated - {getLanguageName(targetLanguage)}
        </button>
        <button 
          className={`result-tab ${activeTab === 'original' ? 'active' : ''}`}
          onClick={() => setActiveTab('original')}
        >
          Original - {getLanguageName(sourceLanguage)}
        </button>
      </div>
      
      <div className="result-content" ref={textRef}>
        {activeTab === 'translated' ? result.translatedText : result.originalText}
      </div>
      
      <div className="result-actions">
        <button 
          className={`btn-icon ${isCopied ? 'copied' : ''}`} 
          onClick={handleCopyText}
          aria-label="Copy text"
        >
          {isCopied ? (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6668 5L7.50016 14.1667L3.3335 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="tooltip">Copied!</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6.66699" y="3.33331" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13.3337 6.66669H14.167C14.6273 6.66669 15.0003 7.03974 15.0003 7.50002V14.1667C15.0003 14.627 14.6273 15 14.167 15H7.50033C7.04004 15 6.66699 14.627 6.66699 14.1667V13.3334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="tooltip">Copy</span>
            </>
          )}
        </button>
        
        <button 
          className="btn-icon" 
          onClick={() => window.print()}
          aria-label="Print"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.83301 5.83331V3.33331H14.1663V5.83331" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.1663 11.6667V16.6667H5.83301V11.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.1663 11.6667H5.83301V8.33335H14.1663V11.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="tooltip">Print</span>
        </button>
        
        <button 
          className="btn-icon" 
          onClick={() => {
            const a = document.createElement('a');
            const blob = new Blob(
              [activeTab === 'translated' ? result.translatedText : result.originalText], 
              { type: 'text/plain' }
            );
            const url = URL.createObjectURL(blob);
            a.href = url;
            a.download = `transcription_${activeTab}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          aria-label="Download"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.0003 3.33331V13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.83301 9.16669L9.99967 13.3334L14.1663 9.16669" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.33301 16.6667H16.6663" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="tooltip">Download</span>
        </button>
        
        <button 
          className="btn btn-primary"
          onClick={onReset}
        >
          New Transcription
        </button>
      </div>
    </div>
  );
};

export default TranscriptionResult;