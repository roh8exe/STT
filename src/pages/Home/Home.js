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
  
  // Show animation after initial render and track scroll position
  useEffect(() => {
    setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    
    // Add scroll event listener to track steps progress
    const handleScroll = () => {
      const modelContainer = document.querySelector('.model-container');
      if (modelContainer) {
        const rect = modelContainer.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.3) {
          modelContainer.classList.add('in-view');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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

  // Reset everything when switching models and scroll to the tool
  const switchModel = (model) => {
    setActiveModel(model);
    setError(null);
    setTranscriptionResult(null);
    setGeneratedAudio(null);
    setTranslatedAudio(null);
    setAudioBlob(null);
    setAudioFile(null);
    setInputText('');
    
    // Scroll to the model container with smooth animation
    setTimeout(() => {
      const container = document.querySelector('.model-container');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Helper function to render model descriptions
  const getModelDescription = () => {
    switch(activeModel) {
      case 'speech-to-text':
        return "Convert spoken language into written text. Perfect for transcriptions, note-taking, and accessibility.";
      case 'text-to-speech':
        return "Transform written content into natural-sounding speech. Great for content consumption, learning, and accessibility.";
      case 'speech-to-speech':
        return "Translate speech from one language to another in real-time. Ideal for multilingual conversations and travel.";
      default:
        return "";
    }
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
            Convert speech to text, text to speech, or translate between languages with our advanced AI models.
          </p>
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
        <div className="model-selector-container">
          <h2 className="section-title">Select Your Tool</h2>
          <div className="model-tabs">
            <button 
              className={`model-tab ${activeModel === 'speech-to-text' ? 'active' : ''}`}
              onClick={() => switchModel('speech-to-text')}
            >
              <span className="model-icon">🎤</span>
              <span className="model-label">Speech to Text</span>
            </button>
            <button 
              className={`model-tab ${activeModel === 'text-to-speech' ? 'active' : ''}`}
              onClick={() => switchModel('text-to-speech')}
            >
              <span className="model-icon">🔊</span>
              <span className="model-label">Text to Speech</span>
            </button>
            <button 
              className={`model-tab ${activeModel === 'speech-to-speech' ? 'active' : ''}`}
              onClick={() => switchModel('speech-to-speech')}
            >
              <span className="model-icon">🗣️</span>
              <span className="model-label">Speech to Speech</span>
            </button>
          </div>
          <p className="model-description">{getModelDescription()}</p>
        </div>
        
        <div className="model-container">
          {/* Speech to Text Model */}
          {activeModel === 'speech-to-text' && (
            <div className="transcription-container">
              {!transcriptionResult ? (
                <>
                  <div className="step-indicator">
                    <div className={`step ${audioBlob || audioFile ? 'active' : ''}`}>
                      <div className="step-number">1</div>
                      <div className="step-text">Input Audio</div>
                    </div>
                    <div className={`step-divider ${audioBlob || audioFile ? 'active' : ''}`}></div>
                    <div className={`step ${audioBlob || audioFile ? 'active' : ''}`}>
                      <div className="step-number">2</div>
                      <div className="step-text">Set Languages</div>
                    </div>
                    <div className={`step-divider ${audioBlob || audioFile && (sourceLanguage !== 'auto' || targetLanguage !== 'en') ? 'active' : ''}`}></div>
                    <div className={`step ${audioBlob || audioFile && (sourceLanguage !== 'auto' || targetLanguage !== 'en') ? 'active' : ''}`}>
                      <div className="step-number">3</div>
                      <div className="step-text">Transcribe</div>
                    </div>
                  </div>

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
                      <small className="helper-text">The language being spoken in the audio</small>
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
                      <small className="helper-text">The language for the transcription output</small>
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
                    <small className="btn-helper-text">{(!audioBlob && !audioFile) ? "Record or upload audio first" : "Click to start transcription"}</small>
                  </div>
                </>
              ) : (
                <>
                  <div className="result-header">
                    <h3>Transcription Results</h3>
                    <button className="btn btn-outline" onClick={resetTranscription}>
                      <span className="btn-icon">↩️</span> New Transcription
                    </button>
                  </div>
                  <TranscriptionResult
                    result={transcriptionResult}
                    sourceLanguage={sourceLanguage}
                    targetLanguage={targetLanguage}
                    onReset={resetTranscription}
                  />
                </>
              )}
            </div>
          )}

          {/* Text to Speech Model */}
          {activeModel === 'text-to-speech' && (
            <div className="text-to-speech-container">
              <div className="step-indicator">
                <div className={`step ${inputText ? 'active' : ''}`}>
                  <div className="step-number">1</div>
                  <div className="step-text">Enter Text</div>
                </div>
                <div className={`step-divider ${inputText ? 'active' : ''}`}></div>
                <div className={`step ${inputText && targetLanguage !== 'en' ? 'active' : ''}`}>
                  <div className="step-number">2</div>
                  <div className="step-text">Choose Language</div>
                </div>
                <div className={`step-divider ${inputText && targetLanguage !== 'en' ? 'active' : ''}`}></div>
                <div className={`step ${inputText && inputText.length > 0 ? 'active' : ''}`}>
                  <div className="step-number">3</div>
                  <div className="step-text">Generate</div>
                </div>
              </div>

              <div className="text-input-section">
                <h3>Enter text to convert to speech</h3>
                <textarea
                  className="text-input"
                  placeholder="Type or paste text here..."
                  value={inputText}
                  onChange={handleInputTextChange}
                  rows={6}
                ></textarea>
                <small className="character-count">{inputText.length} characters</small>
              </div>

              <div className="language-options">
                <div className="language-selection full-width">
                  <h3>Target Voice Language</h3>
                  <LanguageSelector
                    value={targetLanguage}
                    onChange={handleTargetLanguageChange}
                    includeAuto={false}
                  />
                  <small className="helper-text">Select the language for the generated speech</small>
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
                <small className="btn-helper-text">{!inputText.trim() ? "Enter some text first" : "Click to convert text to speech"}</small>
              </div>

              {generatedAudio && (
                <div className="audio-result">
                  <h3>Generated Speech</h3>
                  <div className="audio-player-container">
                    <audio controls src={generatedAudio} className="audio-player" />
                    <div className="audio-controls">
                      <button className="btn btn-icon" onClick={() => document.querySelector('.audio-player').play()}>
                        <span className="btn-icon">▶️</span>
                      </button>
                      <button className="btn btn-icon" onClick={() => document.querySelector('.audio-player').pause()}>
                        <span className="btn-icon">⏸️</span>
                      </button>
                    </div>
                  </div>
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
              <div className="step-indicator">
                <div className={`step ${audioBlob || audioFile ? 'active' : ''}`}>
                  <div className="step-number">1</div>
                  <div className="step-text">Input Audio</div>
                </div>
                <div className={`step-divider ${audioBlob || audioFile ? 'active' : ''}`}></div>
                <div className={`step ${audioBlob || audioFile ? 'active' : ''}`}>
                  <div className="step-number">2</div>
                  <div className="step-text">Set Languages</div>
                </div>
                <div className={`step-divider ${audioBlob || audioFile && (sourceLanguage !== 'auto' || targetLanguage !== 'en') ? 'active' : ''}`}></div>
                <div className={`step ${audioBlob || audioFile && (sourceLanguage !== 'auto' || targetLanguage !== 'en') ? 'active' : ''}`}>
                  <div className="step-number">3</div>
                  <div className="step-text">Translate</div>
                </div>
              </div>

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
                  <small className="helper-text">The language being spoken</small>
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
                  <small className="helper-text">The language to translate to</small>
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
                <small className="btn-helper-text">{(!audioBlob && !audioFile) ? "Record or upload audio first" : "Click to translate speech"}</small>
              </div>

              {translatedAudio && (
                <div className="audio-result">
                  <h3>Translated Speech</h3>
                  <div className="audio-player-container">
                    <audio controls src={translatedAudio} className="audio-player" />
                    <div className="audio-controls">
                      <button className="btn btn-icon" onClick={() => document.querySelector('.audio-player').play()}>
                        <span className="btn-icon">▶️</span>
                      </button>
                      <button className="btn btn-icon" onClick={() => document.querySelector('.audio-player').pause()}>
                        <span className="btn-icon">⏸️</span>
                      </button>
                    </div>
                  </div>
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
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </div>
      </section>

      <section className="features-section">
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