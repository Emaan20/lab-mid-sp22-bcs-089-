import React from 'react';
import { SettingsProvider } from './SettingsContext'; // Adjust the path as needed
import { Stack } from 'expo-router';


export default function RootLayout() {
  return (
    <SettingsProvider>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen 
          name="(screens)/Home" 
          options={{  title:''}}
        />
        <Stack.Screen 
          name="(screens)/About" 
          options={{  title:''}}
        />
         <Stack.Screen name="(screens)/SurahScreen" options={{  title:''}}  />
      </Stack>
    </SettingsProvider>
  );
}
