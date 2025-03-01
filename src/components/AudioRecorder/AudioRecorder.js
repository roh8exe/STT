import React, { useState, useEffect, useRef } from 'react';
import './AudioRecorder.css';
import { transcribeAudio } from '../../services/api';

const AudioRecorder = ({ onAudioRecorded, sourceLan }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [visualizerData, setVisualizerData] = useState([]);
  
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState(null);
  const [transcriptionError, setTranscriptionError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  
  // Setup canvas for visualizer
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Set up audio context for visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const drawVisualizer = () => {
        if (!isRecording) return;
        
        animationRef.current = requestAnimationFrame(drawVisualizer);
        analyserRef.current.getByteFrequencyData(dataArray);
        const normalizedData = Array.from(dataArray).filter((_, i) => i % 4 === 0).map(value => value / 255);
        setVisualizerData(normalizedData);
      };
      
      drawVisualizer();
      
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm')) options = { mimeType: 'audio/webm' };
      else if (MediaRecorder.isTypeSupported('audio/mp4')) options = { mimeType: 'audio/mp4' };
      else if (MediaRecorder.isTypeSupported('audio/ogg')) options = { mimeType: 'audio/ogg' };
      
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current.mimeType });
        setAudioURL(URL.createObjectURL(audioBlob));
        setAudioBlob(audioBlob);
        onAudioRecorded(audioBlob);
        audioChunksRef.current = [];
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to access microphone. Please check your permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      cancelAnimationFrame(animationRef.current);
    }
  };
  
  const handleTranscribe = async () => {
    if (!audioBlob) return;
    
    setIsTranscribing(true);
    setTranscriptionError(null);
    
    try {
      const result = await transcribeAudio(audioBlob, sourceLan);
      
      if (!result || !result.transcript) {
        throw new Error('No transcription received.');
      }
      
      setTranscriptionResult(result);
      onAudioRecorded(audioBlob, result);
    } catch (error) {
      console.error('Transcription error:', error);
      setTranscriptionError(error.message || 'Failed to transcribe audio');
    } finally {
      setIsTranscribing(false);
    }
  };
  
  const resetRecording = () => {
    setAudioURL('');
    setAudioBlob(null);
    setRecordingTime(0);
    setVisualizerData([]);
    setTranscriptionResult(null);
    setTranscriptionError(null);
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="audio-recorder">
      {!audioURL ? (
        <div className="recorder-container">
          <div className="visualizer-container">
            <div className="visualizer">
              {visualizerData.map((value, index) => (
                <div key={index} className="visualizer-bar" style={{ height: `${value * 100}%` }}></div>
              ))}
              {!isRecording && !visualizerData.length && (
                <div className="visualizer-placeholder">
                  <p>Press record to start</p>
                </div>
              )}
            </div>
            <div className="recording-timer">
              {isRecording && (
                <>
                  <div className="recording-indicator"></div>
                  <span>{formatTime(recordingTime)}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="recorder-controls">
            {!isRecording ? (
              <button className="btn-record" onClick={startRecording} aria-label="Start recording">
                🎤 Start Recording
              </button>
            ) : (
              <button className="btn-stop" onClick={stopRecording} aria-label="Stop recording">
                ⏹ Stop Recording
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="recording-preview">
          <audio src={audioURL} controls></audio>
          {!transcriptionResult ? (
            <div className="recording-actions">
              <button className="btn btn-primary" onClick={handleTranscribe} disabled={isTranscribing}>
                {isTranscribing ? 'Transcribing...' : 'Transcribe Audio'}
              </button>
              <button className="btn btn-secondary" onClick={resetRecording} disabled={isTranscribing}>
                Record Again
              </button>
              {transcriptionError && <div className="transcription-error">{transcriptionError}</div>}
            </div>
          ) : (
            <div className="transcription-result">
              <h4>Transcription Result:</h4>
              <p>{transcriptionResult.transcript}</p>
              <button className="btn btn-secondary" onClick={resetRecording}>Record New Audio</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
