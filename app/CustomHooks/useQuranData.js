// File: app/CustomHooks/useQuranData.js
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useQuranData() {
  const [urduSurahs, setUrduSurahs] = useState([]);
  const [englishSurahs, setEnglishSurahs] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const urduData = await AsyncStorage.getItem('urduSurahs');
        const englishData = await AsyncStorage.getItem('englishSurahs');

        if (urduData && englishData) {
          setUrduSurahs(JSON.parse(urduData));
          setEnglishSurahs(JSON.parse(englishData));
        }
      } catch (error) {
        console.error('Error loading Quran data:', error);
      }
    };

    loadData();
  }, []);

  return { urduSurahs, englishSurahs };
}
