import React, { useState, useEffect, useRef } from 'react';
import './AudioRecorder.css';

const AudioRecorder = ({ onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [visualizerData, setVisualizerData] = useState([]);
  
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
      
      // Set canvas dimensions
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
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
      
      // Configure analyzer
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Start drawing visualization
      const drawVisualizer = () => {
        if (!isRecording) return;
        
        animationRef.current = requestAnimationFrame(drawVisualizer);
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Normalize and sample the data for visualization
        const normalizedData = Array.from(dataArray)
          .filter((_, i) => i % 4 === 0) // Sample every 4th value
          .map(value => value / 255); // Normalize to 0-1
        
        setVisualizerData(normalizedData);
      };
      
      drawVisualizer();
      
      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioURL = URL.createObjectURL(audioBlob);
        
        setAudioURL(audioURL);
        setAudioBlob(audioBlob);
        onAudioRecorded(audioBlob);
        
        // Reset chunks for next recording
        audioChunksRef.current = [];
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to access microphone. Please check your permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      clearInterval(timerRef.current);
      
      // Stop all tracks on the stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Stop visualization
      cancelAnimationFrame(animationRef.current);
    }
  };
  
  const resetRecording = () => {
    setAudioURL('');
    setAudioBlob(null);
    setRecordingTime(0);
    setVisualizerData([]);
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  return (
    <div className="audio-recorder">
      {!audioURL ? (
        <div className="recorder-container">
          <div className="visualizer-container">
            <div className="visualizer">
              {visualizerData.map((value, index) => (
                <div 
                  key={index} 
                  className="visualizer-bar"
                  style={{ height: `${value * 100}%` }}
                ></div>
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
              <button 
                className="btn-record" 
                onClick={startRecording}
                aria-label="Start recording"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="currentColor"/>
                </svg>
                <span>Start Recording</span>
              </button>
            ) : (
              <button 
                className="btn-stop" 
                onClick={stopRecording}
                aria-label="Stop recording"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="7" y="7" width="10" height="10" fill="currentColor"/>
                </svg>
                <span>Stop Recording</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="recording-preview">
          <div className="audio-player">
            <audio src={audioURL} controls></audio>
          </div>
          <div className="recording-actions">
            <button 
              className="btn btn-secondary"
              onClick={resetRecording}
            >
              Record Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;