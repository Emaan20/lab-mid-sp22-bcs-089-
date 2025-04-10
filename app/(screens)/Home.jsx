// app/(screens)/Home.jsx
import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import useQuranData from '../CustomHooks/useQuranData';
import { SettingsContext } from '../SettingsContext';

export default function Home() {
  const { englishSurahs, urduSurahs } = useQuranData();
  const { translationLanguage } = useContext(SettingsContext);
  const data = translationLanguage === 'urdu' ? urduSurahs : englishSurahs;
  
  // For example purposes, let's assume we filter for the last 10 surahs
  const lastTenSurahs = data.slice(-10);

  const renderSurahItem = ({ item }) => (
    <TouchableOpacity style={styles.surahItem} onPress={() => { /* Navigate to detailed view */ }}>
      <Link href={`/SurahScreen?surahNumber=${item.SurahNumber}`} style={styles.surahLink}>
        <Text style={styles.surahName}>
          {translationLanguage === 'urdu' ? item.SurahName : item.SurahNameEnglish}
        </Text>
        {/* Optionally show a preview */}
        <Text numberOfLines={1} style={styles.ayahPreview}>
          {item.AyahTextQalam}
        </Text>
      </Link>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList 
        data={lastTenSurahs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderSurahItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  surahItem: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#cefad0',
    borderRadius: 8,
  },
  surahName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ayahPreview: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  surahLink: { textDecorationLine: 'none' },
});
