import React, { useState } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { getCommonLanguages, getLanguageName, getLanguageFlag } from '../../utils/languageUtils';
import './TranslationOptions.css';

const TranslationOptions = ({ 
  sourceLanguage, 
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const commonLanguages = getCommonLanguages();
  
  const handleSourceLanguageChange = (lang) => {
    onSourceLanguageChange(lang);
  };
  
  const handleTargetLanguageChange = (lang) => {
    onTargetLanguageChange(lang);
  };
  
  const swapLanguages = () => {
    // Don't swap if source is 'auto'
    if (sourceLanguage === 'auto') {
      return;
    }
    
    const temp = sourceLanguage;
    onSourceLanguageChange(targetLanguage);
    onTargetLanguageChange(temp);
  };
  
  return (
    <div className="translation-options">
      <div className="language-selection-container">
        <div className="language-selection">
          <h3>Source Language</h3>
          <LanguageSelector
            value={sourceLanguage}
            onChange={handleSourceLanguageChange}
            includeAuto={true}
          />
        </div>
        
        <div className="language-swap">
          <button 
            className="swap-button"
            onClick={swapLanguages}
            disabled={sourceLanguage === 'auto'}
            title={sourceLanguage === 'auto' ? "Cannot swap when source is Auto-detect" : "Swap languages"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10H3L7 6V10Z" fill="currentColor"/>
              <path d="M21 14L17 18V14H21Z" fill="currentColor"/>
              <path d="M21 10H10C9.44772 10 9 9.55228 9 9V7C9 6.44772 9.44772 6 10 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 14H14C14.5523 14 15 14.4477 15 15V17C15 17.5523 14.5523 18 14 18H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="language-selection">
          <h3>Target Language</h3>
          <LanguageSelector
            value={targetLanguage}
            onChange={handleTargetLanguageChange}
            includeAuto={false}
          />
        </div>
      </div>
      
      <div className="quick-languages">
        <h4>Quick Select:</h4>
        <div className="quick-language-options">
          {commonLanguages.map(langCode => (
            <button
              key={langCode}
              className={`quick-language-option ${targetLanguage === langCode ? 'active' : ''}`}
              onClick={() => handleTargetLanguageChange(langCode)}
            >
              <span className="language-flag">{getLanguageFlag(langCode)}</span>
              <span className="language-name">{getLanguageName(langCode)}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="advanced-options">
        <button 
          className="advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span>Advanced Options</span>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {showAdvanced && (
          <div className="advanced-settings">
            <div className="settings-group">
              <h4>Formality</h4>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="formality" value="auto" defaultChecked />
                  <span>Auto</span>
                </label>
                <label className="radio-label">
                  <input type="radio" name="formality" value="formal" />
                  <span>Formal</span>
                </label>
                <label className="radio-label">
                  <input type="radio" name="formality" value="informal" />
                  <span>Informal</span>
                </label>
              </div>
            </div>
            
            <div className="settings-group">
              <h4>Technical Terms</h4>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" name="technical" />
                  <span>Use domain-specific terminology</span>
                </label>
              </div>
            </div>
            
            <div className="settings-group">
              <h4>Dialect Preferences</h4>
              <select className="select-dropdown">
                <option value="standard">Standard</option>
                <option value="us-english">US English</option>
                <option value="uk-english">UK English</option>
                <option value="canadian">Canadian English</option>
                <option value="australian">Australian English</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationOptions;