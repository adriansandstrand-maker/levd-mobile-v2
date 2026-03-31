import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Fonts, Spacing, Radius, CategoryColors } from '@/lib/theme';

const MESSAGES = [
  'Levd leser dokumentet...',
  'Finner riktig kategori...',
  'Analyserer innholdet...',
  'Nesten ferdig...',
];

interface AnalysisLoaderProps {
  onComplete?: () => void;
}

export default function AnalysisLoader({ onComplete }: AnalysisLoaderProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        const next = prev + 1;
        if (next >= MESSAGES.length) {
          clearInterval(interval);
          onComplete?.();
          return prev;
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={CategoryColors.scan.icon} />
        <Text style={styles.message}>{MESSAGES[messageIndex]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  message: {
    fontFamily: Fonts.dmSansMedium,
    fontSize: 16,
    color: Colors.text,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
});
