import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Fonts, Spacing, Radius } from '@/lib/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Document } from '@/types';
import { formatDate, formatDocumentType, getMimeTypeIcon, formatCategory } from '@/lib/formatters';

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category || !user) return;
    (async () => {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('category', category)
        .eq('status', 'complete')
        .order('created_at', { ascending: false });

      if (data) {
        setDocuments(data as Document[]);
      }
      setLoading(false);
    })();
  }, [category, user]);

  const categoryLabel = formatCategory(category || null);

  const renderItem = ({ item }: { item: Document }) => (
    <Pressable
      style={({ pressed }) => [styles.docRow, pressed && styles.pressed]}
      onPress={() =>
        router.push({
          pathname: '/document/[id]',
          params: { id: item.id },
        })
      }
    >
      <View style={styles.docIcon}>
        <FontAwesome
          name={getMimeTypeIcon(item.mime_type) as any}
          size={20}
          color={Colors.accent}
        />
      </View>
      <View style={styles.docContent}>
        <Text style={styles.docName} numberOfLines={1}>
          {formatDocumentType(item.document_type) || item.file_name}
        </Text>
        <Text style={styles.docDate}>{formatDate(item.created_at)}</Text>
      </View>
      <FontAwesome name="chevron-right" size={14} color={Colors.textSecondary} />
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={18} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{categoryLabel}</Text>
        <View style={styles.backButton} />
      </View>

      {documents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="folder-open-o" size={48} color={Colors.border} />
          <Text style={styles.emptyTitle}>Ingen dokumenter</Text>
          <Text style={styles.emptySubtitle}>
            Du har ingen dokumenter i {categoryLabel} ennå
          </Text>
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  docRow: {
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
  docIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  docName: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 15,
    color: Colors.text,
  },
  docDate: {
    fontFamily: Fonts.jetBrainsMono,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 18,
    color: Colors.text,
  },
  emptySubtitle: {
    fontFamily: Fonts.dmSans,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
