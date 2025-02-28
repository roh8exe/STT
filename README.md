# VoiceTranscribe - Speech-to-Text Translation App

VoiceTranscribe is a modern React application that provides powerful speech-to-text capabilities with translation features. This application allows users to record audio directly through their browser or upload audio files, then transcribes the content into text and offers translation into multiple languages.

## Features

- Real-time speech recognition
- Audio file upload and processing
- Support for 100+ languages
- Seamless translation between languages
- Interactive UI with smooth animations
- Responsive design for all devices

## Tech Stack

- React.js
- React Router
- HTML5 Web Audio API
- CSS3 with custom animations
- Modern JavaScript (ES6+)

## Project Structure

```
speech-to-text-translator/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── images/
│       └── fonts/
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── AudioRecorder/
│   │   ├── AudioUploader/
│   │   ├── LanguageSelector/
│   │   ├── TranscriptionResult/
│   │   ├── TranslationOptions/
│   │   └── AnimatedBackground/
│   ├── pages/
│   │   ├── Home/
│   │   ├── About/
│   │   └── Features/
│   ├── utils/
│   │   ├── audioHelpers.js
│   │   └── languageUtils.js
│   ├── hooks/
│   │   └── useAudioRecording.js
│   ├── animations/
│   │   ├── transitions.js
│   │   └── animationHelpers.js
│   ├── styles/
│   │   ├── variables.css
│   │   ├── global.css
│   │   ├── animations.css
│   │   └── reset.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## Getting Started

1. Clone the repository
   ```
   git clone https://github.com/roh8exe/STT.git
   cd STT
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Run the development server
   ```
   npm start
   ```

4. Build for production
   ```
   npm run build
   ```

## AI Integration

This application is designed to easily integrate with your AI model for speech recognition and translation. The UI is fully prepared to connect with any backend service that provides these capabilities.

To integrate your AI model:
1. Update the API endpoints in the service files
2. Configure the appropriate request/response handling
3. Set up any necessary authentication

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [React Documentation](https://reactjs.org/docs/getting-started.html)