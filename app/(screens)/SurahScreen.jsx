// File: app/(screens)/SurahScreen.jsx
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import useQuranData from '../CustomHooks/useQuranData';
import { SettingsContext } from '../SettingsContext';

export default function SurahScreen({ route }) {
  const { englishSurahs, urduSurahs } = useQuranData();
  const { translationLanguage, showTafseer } = useContext(SettingsContext);

  // Choose data array based on selected language.
  const data = translationLanguage === 'urdu' ? urduSurahs : englishSurahs;

  // Get a surahNumber from navigation params if available.
  // Otherwise, use default Surah Al-Fil (assumed as 105).
  const initialSurahNumber = route?.params?.surahNumber
    ? parseInt(route.params.surahNumber, 10)
    : 105;
  const [currentSurahNumber, setCurrentSurahNumber] = useState(initialSurahNumber);
  const [refreshing, setRefreshing] = useState(false);

  // Get the list of ayahs for the current surah.
  const surahAyahs = data.filter(item => parseInt(item.SurahNumber, 10) === currentSurahNumber);

  // If there are no ayahs for this surah, display a message.
  if (!surahAyahs || surahAyahs.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No ayahs found for Surah number {currentSurahNumber}</Text>
      </View>
    );
  }

  // Helper function: if current surah is 114 then next surah is 105; otherwise, increment.
  const getNextSurahNumber = (num) => (num === 114 ? 105 : num + 1);
  
  // Helper function: if current surah is 105 then previous surah is 114; otherwise, decrement.
  const getPreviousSurahNumber = (num) => (num === 105 ? 114 : num - 1);

  // When the user scrolls to the bottom, load the next surah.
  const handleEndReached = () => {
    const nextSurah = getNextSurahNumber(currentSurahNumber);
    setCurrentSurahNumber(nextSurah);
  };

  // Pull-to-refresh loads the previous surah.
  const onRefresh = () => {
    setRefreshing(true);
    const prevSurah = getPreviousSurahNumber(currentSurahNumber);
    setCurrentSurahNumber(prevSurah);
    setRefreshing(false);
  };

  // Render a single ayah item.
  const renderAyah = ({ item }) => {
    // Choose translation based on language.
    const translation =
      translationLanguage === 'urdu'
        ? item.Translation // adjust if your urdu data has a different key
        : item.Translation;
    // Choose tafseer based on language if available.
    const tafseer =
      translationLanguage === 'urdu'
        ? item.Tafseer // adjust accordingly if keys differ
        : item.Tafseer;

    return (
      <View style={styles.ayahContainer}>
        <Text style={styles.ayahText}>{item.AyahTextQalam}</Text>
        <Text style={styles.translationText}>{translation}</Text>
        {showTafseer && tafseer ? (
          <Text style={styles.tafseerText}>Tafseer: {tafseer}</Text>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Display current Surah name in both languages if available */}
      <Text style={styles.surahTitle}>
        {surahAyahs[0].SurahName || 'Surah'}  {surahAyahs[0].SurahNameEnglish || ''}
      </Text>
      <FlatList
        data={surahAyahs}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderAyah}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  surahTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  ayahContainer: {
    marginBottom: 20,
  },
  ayahText: {
    fontSize: 22,
    textAlign: 'right',
    marginBottom: 6,
  },
  translationText: {
    fontSize: 18,
    marginBottom: 6,
  },
  tafseerText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'gray',
  },
});
