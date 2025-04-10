// app/SettingsContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [showTafseer, setShowTafseer] = useState(true); // default = ON
  const [translationLanguage, setTranslationLanguage] = useState('urdu'); // default = 'urdu'
  const [isLoading, setIsLoading] = useState(true);

  const SETTINGS_KEY = 'userSettings';

  // Load saved settings on app startup
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
        if (storedSettings) {
          const parsed = JSON.parse(storedSettings);
          if (typeof parsed.showTafseer === 'boolean') setShowTafseer(parsed.showTafseer);
          if (parsed.translationLanguage) setTranslationLanguage(parsed.translationLanguage);
        }
      } catch (error) {
        console.error('Error loading settings from AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to AsyncStorage when they change
  useEffect(() => {
    if (!isLoading) {
      const saveSettings = async () => {
        try {
          const settings = {
            showTafseer,
            translationLanguage
          };
          await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
          console.error('Error saving settings to AsyncStorage:', error);
        }
      };

      saveSettings();
    }
  }, [showTafseer, translationLanguage, isLoading]);

  const toggleTafseer = () => setShowTafseer(prev => !prev);

  const changeLanguage = (lang) => {
    setTranslationLanguage(lang); // 'urdu' or 'english'
  };

  return (
    <SettingsContext.Provider
      value={{
        showTafseer,
        toggleTafseer,
        translationLanguage,
        changeLanguage,
        isLoading
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
