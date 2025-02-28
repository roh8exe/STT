/**
 * List of supported languages with their codes and names
 */
export const supportedLanguages = [
    { code: 'auto', name: 'Auto detect', flag: '🌐' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
    { code: 'ms', name: 'Malay', flag: '🇲🇾' },
    { code: 'th', name: 'Thai', flag: '🇹🇭' },
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code: 'pl', name: 'Polish', flag: '🇵🇱' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
    { code: 'cs', name: 'Czech', flag: '🇨🇿' },
    { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
    { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
    { code: 'da', name: 'Danish', flag: '🇩🇰' },
    { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
    { code: 'el', name: 'Greek', flag: '🇬🇷' },
    { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
    { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
    { code: 'sk', name: 'Slovak', flag: '🇸🇰' },
    { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
    { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
    { code: 'fa', name: 'Persian', flag: '🇮🇷' },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
    { code: 'af', name: 'Afrikaans', flag: '🇿🇦' }
  ];
  
  /**
   * Get language name by language code
   * @param {string} code - Language code
   * @returns {string} - Language name or code if not found
   */
  export const getLanguageName = (code) => {
    const language = supportedLanguages.find(lang => lang.code === code);
    return language ? language.name : code;
  };
  
  /**
   * Get language flag by language code
   * @param {string} code - Language code
   * @returns {string} - Language flag emoji or empty string if not found
   */
  export const getLanguageFlag = (code) => {
    const language = supportedLanguages.find(lang => lang.code === code);
    return language ? language.flag : '';
  };
  
  /**
   * Filter languages by search term
   * @param {string} searchTerm - Term to search for
   * @param {boolean} includeAuto - Whether to include 'auto' detection option
   * @returns {Array} - Filtered list of languages
   */
  export const filterLanguages = (searchTerm, includeAuto = true) => {
    const availableLanguages = includeAuto
      ? supportedLanguages
      : supportedLanguages.filter(lang => lang.code !== 'auto');
      
    return availableLanguages.filter(
      lang => lang.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  /**
   * Get a list of most common languages for quick selection
   * @returns {Array} - List of common language codes
   */
  export const getCommonLanguages = () => {
    return ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ru', 'ar'];
  };