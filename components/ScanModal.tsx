import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Colors, Fonts, Radius, Spacing, CategoryColors } from '@/lib/theme';

interface ScanModalProps {
  visible: boolean;
  onClose: () => void;
  onFileSelected: (uri: string, name: string, mimeType: string) => void;
}

export default function ScanModal({ visible, onClose, onFileSelected }: ScanModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setError('Kameratilgang er nødvendig');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        onFileSelected(
          asset.uri,
          asset.fileName || `foto_${Date.now()}.jpg`,
          asset.mimeType || 'image/jpeg'
        );
        onClose();
      }
    } catch (e) {
      setError('Kunne ikke åpne kamera');
    }
  };

  const handleGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        onFileSelected(
          asset.uri,
          asset.fileName || `bilde_${Date.now()}.jpg`,
          asset.mimeType || 'image/jpeg'
        );
        onClose();
      }
    } catch (e) {
      setError('Kunne ikke åpne galleri');
    }
  };

  const handleDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        onFileSelected(
          asset.uri,
          asset.name,
          asset.mimeType || 'application/pdf'
        );
        onClose();
      }
    } catch (e) {
      setError('Kunne ikke velge dokument');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Legg til dokument</Text>

          {error && <Text style={styles.error}>{error}</Text>}

          <OptionButton
            icon="camera"
            label="Ta bilde"
            subtitle="Bruk kameraet til å skanne"
            color={CategoryColors.scan.icon}
            bg={CategoryColors.scan.bg}
            onPress={handleCamera}
          />
          <OptionButton
            icon="image"
            label="Velg fra galleri"
            subtitle="Velg et eksisterende bilde"
            color="#4A6A82"
            bg="#C4D5E1"
            onPress={handleGallery}
          />
          <OptionButton
            icon="file-pdf-o"
            label="Last opp PDF"
            subtitle="Velg en PDF-fil"
            color="#5A7A6E"
            bg="#CDDDD6"
            onPress={handleDocument}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function OptionButton({
  icon,
  label,
  subtitle,
  color,
  bg,
  onPress,
}: {
  icon: string;
  label: string;
  subtitle: string;
  color: string;
  bg: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
      onPress={onPress}
    >
      <View style={[styles.optionIcon, { backgroundColor: bg }]}>
        <FontAwesome name={icon as any} size={22} color={color} />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionLabel}>{label}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Fonts.dmSansBold,
    fontSize: 20,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  error: {
    fontFamily: Fonts.dmSans,
    fontSize: 14,
    color: Colors.notification,
    marginBottom: Spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  optionLabel: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 16,
    color: Colors.text,
  },
  optionSubtitle: {
    fontFamily: Fonts.dmSans,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
