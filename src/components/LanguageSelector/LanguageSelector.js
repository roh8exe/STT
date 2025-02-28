import React, { useState, useRef, useEffect } from 'react';
import './LanguageSelector.css';

const LanguageSelector = ({ value, onChange, includeAuto = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const languages = [
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

  // Filter out auto-detect if not needed
  const availableLanguages = includeAuto 
    ? languages 
    : languages.filter(lang => lang.code !== 'auto');

  // Find the selected language
  const selectedLanguage = availableLanguages.find(lang => lang.code === value) || availableLanguages[0];

  // Filtered languages based on search
  const filteredLanguages = availableLanguages.filter(
    lang => lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        setHighlightedIndex(prev => 
          prev < filteredLanguages.length - 1 ? prev + 1 : prev
        );
        e.preventDefault();
        break;
      case 'ArrowUp':
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        e.preventDefault();
        break;
      case 'Enter':
        if (filteredLanguages[highlightedIndex]) {
          handleSelect(filteredLanguages[highlightedIndex]);
        }
        e.preventDefault();
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setHighlightedIndex(0);
    setSearchTerm('');
  };

  const handleSelect = (language) => {
    onChange(language.code);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(0);
  };

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button 
        className="language-select-button"
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onKeyDown={handleKeyDown}
      >
        <span className="language-flag">{selectedLanguage.flag}</span>
        <span className="language-name">{selectedLanguage.name}</span>
        <span className="dropdown-arrow">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          <div className="language-search">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
            />
          </div>
          <ul className="language-list" role="listbox">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language, index) => (
                <li 
                  key={language.code} 
                  className={`language-option ${language.code === value ? 'selected' : ''} ${index === highlightedIndex ? 'highlighted' : ''}`}
                  onClick={() => handleSelect(language)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={language.code === value}
                >
                  <span className="language-flag">{language.flag}</span>
                  <span className="language-name">{language.name}</span>
                </li>
              ))
            ) : (
              <li className="no-results">No languages found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;