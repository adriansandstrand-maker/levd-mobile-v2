import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Fonts, Spacing, Radius } from '@/lib/theme';
import { supabase } from '@/lib/supabase';
import { Document } from '@/types';
import {
  formatDate,
  formatDocumentType,
  formatCategory,
  formatConfidence,
  getMimeTypeIcon,
  isExpired,
  isExpiringSoon,
} from '@/lib/formatters';

export default function DocumentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        const doc = data as Document;
        setDocument(doc);

        // Get signed URL for file preview
        if (doc.file_path) {
          const { data: urlData } = await supabase.storage
            .from('documents')
            .createSignedUrl(doc.file_path, 3600);
          if (urlData?.signedUrl) {
            setSignedUrl(urlData.signedUrl);
          }
        }
      }
      setLoading(false);
    })();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Slett dokument',
      'Er du sikker på at du vil slette dette dokumentet? Dette kan ikke angres.',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Slett',
          style: 'destructive',
          onPress: async () => {
            if (!document) return;
            // Delete from Storage first
            if (document.file_path) {
              await supabase.storage
                .from('documents')
                .remove([document.file_path]);
            }
            // Delete from DB
            await supabase
              .from('documents')
              .delete()
              .eq('id', document.id);
            router.back();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!document) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <FontAwesome name="file-o" size={48} color={Colors.border} />
          <Text style={styles.emptyTitle}>Dokument ikke funnet</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.linkText}>Gå tilbake</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isImage = document.mime_type?.startsWith('image/');
  const isPdf = document.mime_type === 'application/pdf';
  const expiryWarning = isExpired(document.expiry_date)
    ? 'Utgått'
    : isExpiringSoon(document.expiry_date)
    ? 'Utløper snart'
    : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={18} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Dokument</Text>
        <Pressable onPress={handleDelete} style={styles.backButton}>
          <FontAwesome name="trash-o" size={20} color={Colors.notification} />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* File preview */}
        <View style={styles.previewCard}>
          {isImage && signedUrl ? (
            <Image source={{ uri: signedUrl }} style={styles.imagePreview} resizeMode="contain" />
          ) : (
            <View style={styles.fileIconContainer}>
              <FontAwesome
                name={getMimeTypeIcon(document.mime_type) as any}
                size={48}
                color={Colors.accent}
              />
            </View>
          )}
          <Text style={styles.fileName} numberOfLines={2}>
            {document.file_name}
          </Text>
          {document.document_type && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {formatDocumentType(document.document_type)}
              </Text>
            </View>
          )}
        </View>

        {/* Details card */}
        <View style={styles.detailCard}>
          <Text style={styles.detailCardTitle}>Detaljer</Text>

          <DetailRow label="Kategori" value={formatCategory(document.category)} />
          <DetailRow label="Type" value={formatDocumentType(document.document_type)} />
          {document.entity_name && (
            <DetailRow label="Tilknyttet" value={document.entity_name} />
          )}
          <DetailRow label="Lagt til" value={formatDate(document.created_at)} />
          {document.expiry_date && (
            <DetailRow
              label="Utløper"
              value={formatDate(document.expiry_date)}
              warning={expiryWarning}
            />
          )}
          <DetailRow label="Sikkerhet" value={formatConfidence(document.confidence)} />
          <DetailRow label="Status" value={document.status} />
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
            onPress={() =>
              router.push({
                pathname: '/correct/[id]',
                params: { id: document.id },
              })
            }
          >
            <FontAwesome name="pencil" size={16} color={Colors.accent} />
            <Text style={styles.actionButtonText}>Endre type</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionButton, styles.deleteButton, pressed && styles.pressed]}
            onPress={handleDelete}
          >
            <FontAwesome name="trash-o" size={16} color={Colors.notification} />
            <Text style={[styles.actionButtonText, { color: Colors.notification }]}>Slett</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  warning,
}: {
  label: string;
  value: string;
  warning?: string | null;
}) {
  return (
    <View style={detailStyles.row}>
      <Text style={detailStyles.label}>{label}</Text>
      <View style={detailStyles.valueRow}>
        <Text style={detailStyles.value}>{value}</Text>
        {warning && (
          <View style={detailStyles.warningBadge}>
            <Text style={detailStyles.warningText}>{warning}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    fontFamily: Fonts.dmSans,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  value: {
    fontFamily: Fonts.dmSansMedium,
    fontSize: 14,
    color: Colors.text,
  },
  warningBadge: {
    backgroundColor: '#EDDADB',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  warningText: {
    fontFamily: Fonts.dmSansMedium,
    fontSize: 11,
    color: '#7E3535',
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.dmSansBold,
    fontSize: 18,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  previewCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  fileIconContainer: {
    width: 80,
    height: 80,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  fileName: {
    fontFamily: Fonts.dmSansMedium,
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  typeBadge: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  typeBadgeText: {
    fontFamily: Fonts.dmSansMedium,
    fontSize: 13,
    color: Colors.white,
  },
  detailCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  detailCardTitle: {
    fontFamily: Fonts.dmSansBold,
    fontSize: 16,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  deleteButton: {
    backgroundColor: '#EDDADB',
  },
  actionButtonText: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 15,
    color: Colors.accent,
  },
  pressed: {
    opacity: 0.7,
  },
  emptyTitle: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 18,
    color: Colors.text,
  },
  linkText: {
    fontFamily: Fonts.dmSansMedium,
    fontSize: 14,
    color: Colors.accent,
  },
});
