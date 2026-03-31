import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors, Fonts, Spacing, Radius } from '@/lib/theme';
import { categories, CategoryKey } from '@/constants/categories';

interface ConfidenceCardProps {
  confidence: number;
  suggestedCategory: CategoryKey;
  documentName: string;
  onConfirm: () => void;
  onCorrect: () => void;
}

export default function ConfidenceCard({
  confidence,
  suggestedCategory,
  documentName,
  onConfirm,
  onCorrect,
}: ConfidenceCardProps) {
  const category = categories.find((c) => c.key === suggestedCategory);
  const percentage = Math.round(confidence * 100);

  if (confidence >= 0.95) {
    return (
      <View style={styles.container}>
        <View style={[styles.iconCircle, { backgroundColor: '#D2E8D8' }]}>
          <FontAwesome name="check" size={24} color="#3B6B48" />
        </View>
        <Text style={styles.title}>Automatisk arkivert</Text>
        <Text style={styles.subtitle}>
          «{documentName}» ble lagt til i {category?.label} ({percentage}% sikker)
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: category?.colors.bg || Colors.surface }]}>
        <FontAwesome
          name={category?.icon as any || 'file'}
          size={24}
          color={category?.colors.icon || Colors.accent}
        />
      </View>
      <Text style={styles.title}>
        {confidence >= 0.8 ? 'Stemmer dette?' : 'Hjelp oss å kategorisere'}
      </Text>
      <Text style={styles.subtitle}>
        {confidence >= 0.8
          ? `Vi tror «${documentName}» hører til ${category?.label} (${percentage}%)`
          : `Vi er usikre på hvor «${documentName}» hører til`}
      </Text>
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.button, styles.confirmButton, pressed && styles.pressed]}
          onPress={onConfirm}
        >
          <FontAwesome name="check" size={16} color={Colors.white} />
          <Text style={styles.confirmText}>
            {confidence >= 0.8 ? 'Ja, riktig' : 'Bekreft'}
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, styles.correctButton, pressed && styles.pressed]}
          onPress={onCorrect}
        >
          <FontAwesome name="pencil" size={16} color={Colors.accent} />
          <Text style={styles.correctText}>Endre</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    margin: Spacing.md,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Fonts.dmSansBold,
    fontSize: 18,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.dmSans,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    gap: Spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  confirmButton: {
    backgroundColor: Colors.accent,
  },
  correctButton: {
    backgroundColor: Colors.surface,
  },
  confirmText: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 15,
    color: Colors.white,
  },
  correctText: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 15,
    color: Colors.accent,
  },
});
