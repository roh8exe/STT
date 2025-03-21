import React, { useState, useEffect } from 'react';
import AudioRecorder from '../../components/AudioRecorder/AudioRecorder';
import AudioUploader from '../../components/AudioUploader/AudioUploader';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import TranscriptionResult from '../../components/TranscriptResult/TranscriptionResult';
import { transcribeAudio, translateText, textToSpeech } from '../../services/api';

// ✅ NEW Imports for React Transliterate
import { ReactTransliterate } from 'react-transliterate';
import 'react-transliterate/dist/index.css';

import './Home.css';

const Home = () => {
  const [activeModel, setActiveModel] = useState('speech-to-text');

  const [activeTab, setActiveTab] = useState('record');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState(null);

  const [inputText, setInputText] = useState('');
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState(null);

  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedAudio, setTranslatedAudio] = useState(null);

  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isAnimated, setIsAnimated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setIsAnimated(true);
    }, 100);

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
    handleScroll();

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

  const handleInputTextChange = (text) => {
    setInputText(text);
  };

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

  const handleGenerateSpeech = async () => {
    if (!inputText) return;

    setIsGeneratingSpeech(true);
    setError(null);

    try {
      const inputLanguage = sourceLanguage !== 'auto' ? sourceLanguage : null;
      const result = await textToSpeech(inputText, targetLanguage, inputLanguage);
      setGeneratedAudio(result.audioUrl);
    } catch (err) {
      console.error('Text to speech error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate speech');
    } finally {
      setIsGeneratingSpeech(false);
    }
  };

  const handleSpeechToSpeech = async () => {
    if (!audioBlob && !audioFile) return;

    setIsTranslating(true);
    setError(null);

    try {
      const audioSource = audioBlob || audioFile;
      const transcriptionResult = await transcribeAudio(audioSource, sourceLanguage);

      const translationResult = await translateText(
        transcriptionResult.transcript,
        sourceLanguage,
        targetLanguage
      );

      const speechResult = await textToSpeech(translationResult.translatedText, targetLanguage);
      setTranslatedAudio(speechResult.audioUrl);
    } catch (err) {
      console.error('Speech to speech error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to translate speech');
    } finally {
      setIsTranslating(false);
    }
  };

  const switchModel = (model) => {
    setActiveModel(model);
    setError(null);
    setTranscriptionResult(null);
    setGeneratedAudio(null);
    setTranslatedAudio(null);
    setAudioBlob(null);
    setAudioFile(null);
    setInputText('');

    setTimeout(() => {
      const container = document.querySelector('.model-container');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const getModelDescription = () => {
    switch (activeModel) {
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

  // ✅ Determine transliterateLang for ReactTransliterate (default to 'hi' if 'auto')
  const transliterateLang = sourceLanguage !== 'auto' ? sourceLanguage : 'en';

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
      </section>

      <section className="models-section">
        <div className="model-selector-container">
          <h2 className="section-title">Select Your Tool</h2>
          <div className="model-tabs">
            <button 
              className={`model-tab ${activeModel === 'speech-to-text' ? 'active' : ''}`}
              onClick={() => switchModel('speech-to-text')}
            >🎤 Speech to Text</button>

            <button 
              className={`model-tab ${activeModel === 'text-to-speech' ? 'active' : ''}`}
              onClick={() => switchModel('text-to-speech')}
            >🔊 Text to Speech</button>

            <button 
              className={`model-tab ${activeModel === 'speech-to-speech' ? 'active' : ''}`}
              onClick={() => switchModel('speech-to-speech')}
            >🗣️ Speech to Speech</button>
          </div>
          <p className="model-description">{getModelDescription()}</p>
        </div>

        <div className="model-container">
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
                  <div className="step-text">Choose Languages</div>
                </div>
                <div className={`step-divider ${inputText && targetLanguage !== 'en' ? 'active' : ''}`}></div>
                <div className={`step ${inputText && inputText.length > 0 ? 'active' : ''}`}>
                  <div className="step-number">3</div>
                  <div className="step-text">Generate</div>
                </div>
              </div>

              <div className="text-input-section">
                <h3>Enter text to convert to speech</h3>
                <ReactTransliterate
                  renderComponent={(props) => (
                    <textarea {...props} rows={6} className="text-input" />
                  )}
                  value={inputText}
                  onChangeText={handleInputTextChange}
                  lang={transliterateLang}
                  containerStyles={{
                    backgroundColor: '#000',  // Entire box background
                    color: '#fff',            // Text color inside box
                    border: '1px solid #333',
                    borderRadius: '5px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',
                    marginTop: '5px',
                    padding: '5px',
                    zIndex: 10000,            // Ensure it stays on top
                  }}
                  activeItemStyles={{
                    backgroundColor: '#333',  // Active/highlighted suggestion
                    color: '#fff'
                  }}
                />
                <small className="character-count">{inputText.length} characters</small>
              </div>

              <div className="language-options">
                <div className="language-selection">
                  <h3>Input Text Language</h3>
                  <LanguageSelector
                    value={sourceLanguage}
                    onChange={handleSourceLanguageChange}
                    includeAuto={false}
                  />
                </div>

                <div className="language-divider">➡️</div>

                <div className="language-selection">
                  <h3>Output Voice Language</h3>
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
                    <>🔄 Generating Speech...</>
                  ) : (
                    "Generate Speech"
                  )}
                </button>
              </div>

              {generatedAudio && (
                <div className="audio-result">
                  <h3>Generated Speech</h3>
                  <audio controls src={generatedAudio} className="audio-player" />
                  <button className="btn btn-secondary full-width" onClick={() => setGeneratedAudio(null)}>
                    Reset
                  </button>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
