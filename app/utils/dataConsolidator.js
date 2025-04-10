import AsyncStorage from '@react-native-async-storage/async-storage';
import urduData from '../../assets/data/2-urdu.json';
import englishData from '../../assets/data/1-english.json';

export const consolidateQuranData = async () => {
  try {
    const cleanedData = [];

    // Loop through the English data
    for (const engItem of englishData) {
      const matchingUrdu = urduData.find(
        (urduItem) =>
          urduItem.SurahNumber === engItem.SurahNumber &&
          urduItem.AyahNumber === engItem.AyahNumber
      );

      if (matchingUrdu) {
        
        cleanedData.push({
          SurahNumber: engItem.SurahNumber,
          AyahNumber: engItem.AyahNumber,
          AyahTextQalam: engItem.AyahTextQalam || '',

          Translation: {
            english: engItem.Translation || '',
            urdu: matchingUrdu.Translation || '',
          },

          SurahName: matchingUrdu.SurahName || '',
          SurahNameEnglish: engItem.SurahNameEnglish || '',

          Tafseer: {
            english: engItem.Tafseer || '',
            urdu: matchingUrdu.Tafseer || '',
          },
        });
      }
    }

    // Save the cleaned & merged data to AsyncStorage
    await AsyncStorage.setItem('consolidatedQuranData', JSON.stringify(cleanedData));
    console.log('✅ Quran data consolidated and saved to AsyncStorage.');
  } catch (error) {
    console.error('❌ Error consolidating Quran data:', error);
  }
};
