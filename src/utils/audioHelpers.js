/**
 * Format file size to human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size string
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  /**
   * Format seconds to MM:SS time format
   * @param {number} seconds - Time in seconds
   * @returns {string} - Formatted time string
   */
  export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  /**
   * Check if the provided file is an allowed audio type
   * @param {File} file - File to check
   * @returns {boolean} - Whether the file is an allowed audio type
   */
  export const isAllowedAudioType = (file) => {
    const allowedTypes = [
      'audio/mpeg', 
      'audio/mp3', 
      'audio/mp4', 
      'audio/wav', 
      'audio/ogg', 
      'audio/webm', 
      'audio/flac'
    ];
    
    return allowedTypes.includes(file.type);
  };
  
  /**
   * Get a clean file name (without extension)
   * @param {string} filename - Original filename
   * @returns {string} - Cleaned filename
   */
  export const getCleanFileName = (filename) => {
    return filename.replace(/\.[^/.]+$/, "");
  };
  
  /**
   * Create audio visualization data from a buffer
   * @param {AudioBuffer} audioBuffer - Audio buffer to analyze
   * @returns {Array} - Array of audio data for visualization
   */
  export const createVisualizationData = (audioBuffer) => {
    const rawData = audioBuffer.getChannelData(0);
    const samples = 70; // Number of data points we want
    const blockSize = Math.floor(rawData.length / samples);
    const filteredData = [];
    
    for (let i = 0; i < samples; i++) {
      const blockStart = blockSize * i;
      let sum = 0;
      
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[blockStart + j]);
      }
      
      filteredData.push(sum / blockSize);
    }
    
    // Normalize the data
    const multiplier = 1 / Math.max(...filteredData);
    
    return filteredData.map(n => n * multiplier);
  };