import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors, Fonts, Radius, Spacing } from '@/lib/theme';
import { Category } from '@/constants/categories';

interface CategoryRowProps {
  category: Category;
  count?: number;
  onPress?: () => void;
}

export default function CategoryRow({ category, count = 0, onPress }: CategoryRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.colors.bg }]}>
        <FontAwesome
          name={category.icon as any}
          size={20}
          color={category.colors.icon}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{category.label}</Text>
        <Text style={styles.count}>
          {count} {count === 1 ? 'dokument' : 'dokumenter'}
        </Text>
      </View>
      <FontAwesome name="chevron-right" size={14} color={Colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  label: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 16,
    color: Colors.text,
  },
  count: {
    fontFamily: Fonts.dmSans,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
