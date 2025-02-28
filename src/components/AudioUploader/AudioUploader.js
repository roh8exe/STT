import React, { useState, useRef } from 'react';
import { formatFileSize, isAllowedAudioType } from '../../utils/audioHelpers';
import './AudioUploader.css';

const AudioUploader = ({ onAudioUploaded }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  };
  
  const processFile = (selectedFile) => {
    setError('');
    
    if (!selectedFile) return;
    
    // Check if file type is allowed
    if (!isAllowedAudioType(selectedFile)) {
      setError('Please upload an audio file (MP3, WAV, OGG, etc.)');
      return;
    }
    
    // Check file size (max 100MB)
    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('File size exceeds 100MB limit');
      return;
    }
    
    setFile(selectedFile);
    onAudioUploaded(selectedFile);
    
    // Create URL for audio preview
    const url = URL.createObjectURL(selectedFile);
    setAudioURL(url);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const resetUpload = () => {
    setFile(null);
    setAudioURL('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="audio-uploader">
      {!file ? (
        <div 
          className={`upload-container ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/*"
            className="file-input"
          />
          
          <div className="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12L12 8M12 8L16 12M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="upload-text">
            <h3>Upload an audio file</h3>
            <p>Drag and drop your file here or <button className="upload-button" onClick={triggerFileInput}>browse</button></p>
            <p className="upload-formats">Supports MP3, WAV, OGG, FLAC (Max 100MB)</p>
            {error && <p className="upload-error">{error}</p>}
          </div>
        </div>
      ) : (
        <div className="file-preview">
          <div className="file-info">
            <div className="file-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 16L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 8H16V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="file-details">
              <h4>{file.name}</h4>
              <p>{formatFileSize(file.size)}</p>
            </div>
          </div>
          
          <div className="audio-player">
            <audio src={audioURL} controls></audio>
          </div>
          
          <div className="file-actions">
            <button 
              className="btn btn-secondary"
              onClick={resetUpload}
            >
              Upload Different File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;