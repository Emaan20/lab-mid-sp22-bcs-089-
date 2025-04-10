// app/screens/Settings.jsx
import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet, Button } from 'react-native';
import { SettingsContext } from '../SettingsContext';

export default function Settings() {
  const {
    showTafseer,
    toggleTafseer,
    translationLanguage,
    changeLanguage
  } = useContext(SettingsContext);

  return (
    <View style={styles.container}>
      {/* Toggle for Tafseer */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Show Tafseer:</Text>
        <Switch
          onValueChange={toggleTafseer}
          value={showTafseer}
        />
      </View>

      {/* Buttons or Switch for Language */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Translation Language:</Text>
        <Button
          title="Urdu"
          onPress={() => changeLanguage('urdu')}
          color={translationLanguage === 'urdu' ? 'green' : 'gray'}
        />
        <Button
          title="English"
          onPress={() => changeLanguage('english')}
          color={translationLanguage === 'english' ? 'green' : 'gray'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  label: { fontSize: 16, marginRight: 10 },
});
