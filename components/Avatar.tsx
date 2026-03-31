import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AvatarColors, Fonts } from '@/lib/theme';

interface AvatarProps {
  name: string;
  size?: number;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (parts[0]?.[0] || '?').toUpperCase();
}

export default function Avatar({ name, size = 52 }: AvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AvatarColors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: AvatarColors.text,
    fontFamily: Fonts.dmSansSemiBold,
  },
});
