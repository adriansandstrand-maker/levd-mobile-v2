import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Spacing, Radius, CategoryColors } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { getUserDocumentIds } from '@/lib/documents';
import { Document } from '@/types';
import { formatDate, formatDocumentTitle, formatCategory, getFileTypeIcon } from '@/lib/formatters';

export default function SearchScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (!user || text.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const docIds = await getUserDocumentIds(user.id);
      if (docIds.length === 0) {
        setResults([]);
        setLoading(false);
        return;
      }

      const searchTerm = `%${text.trim().toLowerCase()}%`;

      const { data } = await supabase
        .from('documents')
        .select('*')
        .in('id', docIds)
        .or(`file_name.ilike.${searchTerm},title.ilike.${searchTerm},category.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .order('created_at', { ascending: false })
        .limit(30);

      setResults((data as Document[]) || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getCategoryColor = (category: string | null) => {
    if (!category) return { bg: Colors.surface, icon: Colors.textSecondary };
    return CategoryColors[category] || { bg: Colors.surface, icon: Colors.textSecondary };
  };

  const renderItem = ({ item }: { item: Document }) => {
    const catColors = getCategoryColor(item.category);
    return (
      <Pressable
        style={({ pressed }) => [styles.resultRow, pressed && styles.pressed]}
        onPress={() =>
          router.push({
            pathname: '/document/[id]',
            params: { id: item.id },
          })
        }
      >
        <View style={[styles.resultIcon, { backgroundColor: catColors.bg }]}>
          <FontAwesome
            name={getFileTypeIcon(item.file_type) as any}
            size={18}
            color={catColors.icon}
          />
        </View>
        <View style={styles.resultContent}>
          <Text style={styles.resultName} numberOfLines={1}>
            {item.title || item.file_name}
          </Text>
          <Text style={styles.resultMeta} numberOfLines={1}>
            {formatCategory(item.category)} · {formatDate(item.created_at)}
          </Text>
        </View>
        <FontAwesome name="chevron-right" size={14} color={Colors.textSecondary} />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sok</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={16} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Sok i dokumenter..."
            placeholderTextColor={Colors.textSecondary}
            value={query}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => handleSearch('')}>
              <FontAwesome name="times-circle" size={18} color={Colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : !searched ? (
        <View style={styles.centerContainer}>
          <FontAwesome name="search" size={48} color={Colors.border} />
          <Text style={styles.emptyTitle}>Sok etter dokumenter</Text>
          <Text style={styles.emptySubtitle}>
            Sok etter navn, type eller kategori
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.centerContainer}>
          <FontAwesome name="file-o" size={48} color={Colors.border} />
          <Text style={styles.emptyTitle}>Ingen resultater</Text>
          <Text style={styles.emptySubtitle}>
            Prov et annet sokeord
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
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
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    fontFamily: Fonts.dmSansBold,
    fontSize: 28,
    color: Colors.text,
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.dmSans,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: Spacing.xs,
  },
  centerContainer: {
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
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  resultRow: {
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
  resultIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  resultName: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 15,
    color: Colors.text,
  },
  resultMeta: {
    fontFamily: Fonts.dmSans,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
