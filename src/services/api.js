import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

// Transcribe Audio
export const transcribeAudio = async (audioBlob, sourceLang = 'auto') => {
  const formData = new FormData();
  
  // Create a File from the audio blob
  const file = new File([audioBlob], "audio.webm", { type: "audio/webm" });
  
  formData.append('audio', file);
  formData.append('sourceLang', sourceLang); // Ensure key matches Flask backend

  try {
    console.log('Sending transcription request to:', `${API_URL}/transcribe`);
    const response = await axios.post(`${API_URL}/transcribe`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    console.log('Transcription response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in transcribeAudio:', error.response?.data || error.message);
    throw error;
  }
};

// Translate Text
export const translateText = async (text, sourceLang, targetLang) => {
  try {
    console.log('Sending translation request to:', `${API_URL}/translate`);
    const response = await axios.post(`${API_URL}/translate`, {
      text,
      sourceLang,
      targetLang
    });

    console.log('Translation response:', response.data);
    return response.data; // Ensure backend returns { translatedText: "..." }
  } catch (error) {
    console.error('Error in translateText:', error.response?.data || error.message);
    throw error;
  }
};

// API Status Check
export const checkAPIStatus = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.status === 200;
  } catch (error) {
    console.error('API connection error:', error.message);
    return false;
  }
};
