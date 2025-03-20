import React, { useState, useEffect } from 'react';
import AudioRecorder from '../../components/AudioRecorder/AudioRecorder';
import AudioUploader from '../../components/AudioUploader/AudioUploader';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import TranscriptionResult from '../../components/TranscriptResult/TranscriptionResult';
import { transcribeAudio, translateText, textToSpeech } from '../../services/api';
import './Home.css';

const Home = () => {
  // State for model selection
  const [activeModel, setActiveModel] = useState('speech-to-text');
  
  // Speech to Text states
  const [activeTab, setActiveTab] = useState('record');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState(null);
  
  // Text to Speech states
  const [inputText, setInputText] = useState('');
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState(null);
  
  // Speech to Speech states
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedAudio, setTranslatedAudio] = useState(null);
  
  // Common states
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isAnimated, setIsAnimated] = useState(false);
  const [error, setError] = useState(null);
  
  // Show animation after initial render
  useEffect(() => {
    setTimeout(() => {
      setIsAnimated(true);
    }, 100);
  }, []);

  const resetTranscription = () => {
    setTranscriptionResult(null);
  };

  const handleAudioRecorded = (blob, transcriptionData = null) => {
    setAudioBlob(blob);
    setAudioFile(null);

    if (transcriptionData) {
      setTranscriptionResult({
        originalText: transcriptionData.transcript,
        translatedText: transcriptionData.transcript,
        detectedLanguage: transcriptionData.detectedLanguage,
        confidence: 0.95,
      });
    }
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

  const handleInputTextChange = (e) => {
    setInputText(e.target.value);
  };

  // Handle speech to text transcription
  const handleTranscribe = async () => {
    if (!audioBlob && !audioFile) return;
  
    setIsTranscribing(true);
    setError(null);
  
    try {
      const audioSource = audioBlob || audioFile;
      const result = await transcribeAudio(audioSource, sourceLanguage);
      const transcribedText = result.transcript;
  
      let translatedText = transcribedText;
  
      if (sourceLanguage !== targetLanguage) {
        const translationResult = await translateText(transcribedText, sourceLanguage, targetLanguage);
        translatedText = translationResult.translatedText;
      }
  
      setTranscriptionResult({
        originalText: transcribedText,
        translatedText: translatedText,
        detectedLanguage: result.detectedLanguage,
        confidence: 0.95,
        duration: result.processingTime || 0
      });
    } catch (err) {
      console.error('Transcription error:', err);
      setError(err.message || 'Failed to transcribe audio');
    } finally {
      setIsTranscribing(false);
    }
  };

  // Handle text to speech generation
  const handleGenerateSpeech = async () => {
    if (!inputText) return;
    
    setIsGeneratingSpeech(true);
    setError(null);
    
    try {
      const result = await textToSpeech(inputText, targetLanguage);
      setGeneratedAudio(result.audioUrl);
    } catch (err) {
      console.error('Text to speech error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate speech');
    } finally {
      setIsGeneratingSpeech(false);
    }
  };

  // Handle speech to speech translation
  const handleSpeechToSpeech = async () => {
    if (!audioBlob && !audioFile) return;
    
    setIsTranslating(true);
    setError(null);
    
    try {
      // Step 1: Transcribe the audio
      const audioSource = audioBlob || audioFile;
      const transcriptionResult = await transcribeAudio(audioSource, sourceLanguage);
      
      // Step 2: Translate the text
      const translationResult = await translateText(
        transcriptionResult.transcript, 
        sourceLanguage, 
        targetLanguage
      );
      
      // Step 3: Convert translated text to speech
      const speechResult = await textToSpeech(
        translationResult.translatedText,
        targetLanguage
      );
      
      setTranslatedAudio(speechResult.audioUrl);
      
      console.log('Speech to speech translation completed with:', {
        originalText: transcriptionResult.transcript,
        translatedText: translationResult.translatedText,
        targetLanguage: targetLanguage
      });
    } catch (err) {
      console.error('Speech to speech error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to translate speech');
    } finally {
      setIsTranslating(false);
    }
  };

  // Reset everything when switching models
  const switchModel = (model) => {
    setActiveModel(model);
    setError(null);
    setTranscriptionResult(null);
    setGeneratedAudio(null);
    setTranslatedAudio(null);
    setAudioBlob(null);
    setAudioFile(null);
    setInputText('');
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className={`hero-content ${isAnimated ? 'animate-fade-in' : ''}`}>
          <div className="hero-badges">
            <span className="hero-badge">AI-Powered</span>
            <span className="hero-badge">100+ Languages</span>
            <span className="hero-badge">Real-time</span>
          </div>
          <h1 className="hero-title">
            <span className="gradient-text">Voice & Text</span> Translation Suite
          </h1>
          <p className="hero-subtitle">
            Our advanced AI models provide seamless conversion between speech and text in multiple languages. 
            Perfect for meetings, content creation, language learning, and global communication.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">Languages</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">95%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Availability</span>
            </div>
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

      <section className="models-section">
        <div className="model-tabs">
          <button 
            className={`model-tab ${activeModel === 'speech-to-text' ? 'active' : ''}`}
            onClick={() => switchModel('speech-to-text')}
          >
            <span className="model-icon">🎤</span>
            Speech to Text
          </button>
          <button 
            className={`model-tab ${activeModel === 'text-to-speech' ? 'active' : ''}`}
            onClick={() => switchModel('text-to-speech')}
          >
            <span className="model-icon">🔊</span>
            Text to Speech
          </button>
          <button 
            className={`model-tab ${activeModel === 'speech-to-speech' ? 'active' : ''}`}
            onClick={() => switchModel('speech-to-speech')}
          >
            <span className="model-icon">🗣️</span>
            Speech to Speech
          </button>
        </div>
        
        <div className="model-container">
          {/* Speech to Text Model */}
          {activeModel === 'speech-to-text' && (
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
                      <AudioRecorder 
                        onAudioRecorded={handleAudioRecorded} 
                        sourceLanguage={sourceLanguage}
                      />
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
          )}

          {/* Text to Speech Model */}
          {activeModel === 'text-to-speech' && (
            <div className="text-to-speech-container">
              <div className="text-input-section">
                <h3>Enter text to convert to speech</h3>
                <textarea
                  className="text-input"
                  placeholder="Type or paste text here..."
                  value={inputText}
                  onChange={handleInputTextChange}
                  rows={6}
                ></textarea>
              </div>

              <div className="language-options">
                <div className="language-selection full-width">
                  <h3>Target Voice Language</h3>
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
                  onClick={handleGenerateSpeech}
                  disabled={!inputText.trim()}
                >
                  {isGeneratingSpeech ? (
                    <>
                      <span className="loading-spinner"></span>
                      Generating Speech...
                    </>
                  ) : (
                    "Generate Speech"
                  )}
                </button>
              </div>

              {generatedAudio && (
                <div className="audio-result">
                  <h3>Generated Speech</h3>
                  <audio controls src={generatedAudio} className="audio-player" />
                  <div className="action-button mt-4">
                    <button className="btn btn-secondary full-width" onClick={() => setGeneratedAudio(null)}>
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Speech to Speech Model */}
          {activeModel === 'speech-to-speech' && (
            <div className="speech-to-speech-container">
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
                  <AudioRecorder 
                    onAudioRecorded={handleAudioRecorded} 
                    sourceLanguage={sourceLanguage}
                  />
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
                  onClick={handleSpeechToSpeech}
                  disabled={!audioBlob && !audioFile}
                >
                  {isTranslating ? (
                    <>
                      <span className="loading-spinner"></span>
                      Translating Speech...
                    </>
                  ) : (
                    "Translate Speech"
                  )}
                </button>
              </div>

              {translatedAudio && (
                <div className="audio-result">
                  <h3>Translated Speech</h3>
                  <audio controls src={translatedAudio} className="audio-player" />
                  <div className="action-button mt-4">
                    <button className="btn btn-secondary full-width" onClick={() => setTranslatedAudio(null)}>
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Error display (for all models) */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Features</h2>
          <p className="section-subtitle">
            Powerful AI voice solutions at your fingertips
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
            <h3>Speech to Text</h3>
            <p>Convert spoken words to written text with high accuracy, supporting multiple languages and accents.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3333 8.33325H10C8.15905 8.33325 6.66667 9.82563 6.66667 11.6666V30.0001C6.66667 31.841 8.15905 33.3334 10 33.3334H30C31.8409 33.3334 33.3333 31.841 33.3333 30.0001V26.6666" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M26.6667 8.33325H33.3334V14.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.6667 24.9999L33.3334 8.33325" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Text to Speech</h3>
            <p>Transform written content into natural-sounding speech with customizable voices and languages.</p>
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
            <h3>Speech to Speech</h3>
            <p>Instantly translate spoken words from one language to another, preserving tone and context.</p>
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
            <h3>Multi-Language Support</h3>
            <p>Support for 100+ languages, making global communication seamless and accessible to everyone.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;