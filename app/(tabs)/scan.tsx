import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '@/lib/theme';

// This screen is never shown — the tab press is intercepted to open the ScanModal.
// It exists only so expo-router has a valid route for the tab.
export default function ScanScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Skann</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: Fonts.dmSans,
    fontSize: 16,
    color: Colors.textSecondary,
  },
});
