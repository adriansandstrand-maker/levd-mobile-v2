import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Spacing, Radius, CategoryColors, QuickActionColors } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Avatar from '@/components/Avatar';
import CategoryRow from '@/components/CategoryRow';
import { categories, CategoryKey } from '@/constants/categories';
import { Document } from '@/types';
import { formatDate, formatDocumentType, getMimeTypeIcon } from '@/lib/formatters';

function getGreetingEmoji(): string {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? '☀️' : '🌙';
}

function getFirstName(user: any): string {
  const fullName = user?.user_metadata?.full_name || user?.email || 'bruker';
  return fullName.split(' ')[0];
}

const initialCounts: Record<CategoryKey, number> = {
  forsikringer: 0,
  kjoretoy: 0,
  helse: 0,
  familie: 0,
  okonomi: 0,
  jus: 0,
  id: 0,
  utdanning: 0,
  reise: 0,
  bolig: 0,
  annet: 0,
};

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [counts, setCounts] = useState<Record<CategoryKey, number>>({ ...initialCounts });
  const [recentDocs, setRecentDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const { data: countData } = await supabase
        .from('documents')
        .select('category')
        .eq('user_id', user.id)
        .eq('status', 'complete');

      if (countData) {
        const newCounts: Record<string, number> = { ...initialCounts };
        countData.forEach((doc: any) => {
          if (doc.category && newCounts[doc.category] !== undefined) {
            newCounts[doc.category]++;
          }
        });
        setCounts(newCounts as Record<CategoryKey, number>);
      }

      const { data: recentData } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'complete')
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentData) {
        setRecentDocs(recentData as Document[]);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const fullName = user?.user_metadata?.full_name || user?.email || 'Bruker';
  const firstName = getFirstName(user);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Avatar name={fullName} size={52} />
            <View style={styles.headerText}>
              <Text style={styles.greeting}>
                Hei, {firstName} {getGreetingEmoji()}
              </Text>
              <Text style={styles.brand}>LEVD</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconButton}>
              <FontAwesome name="bell-o" size={20} color={Colors.text} />
            </Pressable>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickAction
            icon="search"
            label="Sok"
            colors={QuickActionColors.search}
            onPress={() => router.push('/(tabs)/search' as any)}
          />
          <QuickAction
            icon="plus"
            label="Legg til"
            colors={QuickActionColors.add}
          />
        </View>

        {/* Scan Prompt Card */}
        <Pressable style={styles.scanCard}>
          <View style={styles.scanIconContainer}>
            <FontAwesome name="file-text" size={24} color={CategoryColors.scan.icon} />
          </View>
          <View style={styles.scanContent}>
            <Text style={styles.scanTitle}>Ta bilde av et dokument</Text>
            <Text style={styles.scanSubtitle}>Levd finner riktig plass selv</Text>
          </View>
          <FontAwesome name="chevron-right" size={14} color={CategoryColors.scan.icon} />
        </Pressable>

        {/* Loading state */}
        {loading ? (
          <View style={styles.loadingContainer}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.skeletonRow}>
                <View style={styles.skeletonIcon} />
                <View style={styles.skeletonContent}>
                  <View style={styles.skeletonTitle} />
                  <View style={styles.skeletonSubtitle} />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <>
            {/* Recent Documents */}
            {recentDocs.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Nylig lagt til</Text>
                {recentDocs.map((doc) => (
                  <Pressable
                    key={doc.id}
                    style={({ pressed }) => [styles.recentRow, pressed && { opacity: 0.7 }]}
                    onPress={() =>
                      router.push({
                        pathname: '/document/[id]',
                        params: { id: doc.id },
                      })
                    }
                  >
                    <View style={styles.recentIcon}>
                      <FontAwesome
                        name={getMimeTypeIcon(doc.mime_type) as any}
                        size={18}
                        color={Colors.accent}
                      />
                    </View>
                    <View style={styles.recentContent}>
                      <Text style={styles.recentName} numberOfLines={1}>
                        {formatDocumentType(doc.document_type) || doc.file_name}
                      </Text>
                      <Text style={styles.recentDate}>{formatDate(doc.created_at)}</Text>
                    </View>
                    <FontAwesome name="chevron-right" size={14} color={Colors.textSecondary} />
                  </Pressable>
                ))}
              </>
            )}

            {/* Categories */}
            <Text style={[styles.sectionTitle, recentDocs.length > 0 && { marginTop: Spacing.md }]}>
              Kategorier
            </Text>
            {categories.map((cat) => (
              <CategoryRow
                key={cat.key}
                category={cat}
                count={counts[cat.key]}
                onPress={() =>
                  router.push({
                    pathname: '/category/[category]',
                    params: { category: cat.key },
                  })
                }
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({
  icon,
  label,
  colors,
  onPress,
}: {
  icon: string;
  label: string;
  colors: { bg: string; icon: string };
  onPress?: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.7 }]} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: colors.bg }]}>
        <FontAwesome name={icon as any} size={18} color={colors.icon} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: Spacing.md,
  },
  greeting: {
    fontFamily: Fonts.frauncesItalic,
    fontSize: 22,
    color: Colors.text,
  },
  brand: {
    fontFamily: Fonts.jetBrainsMono,
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 2,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconButton: {
    position: 'relative',
    padding: Spacing.xs,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionLabel: {
    fontFamily: Fonts.dmSansMedium,
    fontSize: 13,
    color: Colors.text,
  },
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CategoryColors.scan.bg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  scanIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  scanTitle: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 15,
    color: Colors.text,
  },
  scanSubtitle: {
    fontFamily: Fonts.dmSans,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: Fonts.dmSansBold,
    fontSize: 18,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  recentName: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 15,
    color: Colors.text,
  },
  recentDate: {
    fontFamily: Fonts.jetBrainsMono,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  loadingContainer: {
    gap: Spacing.sm,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  skeletonIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },
  skeletonContent: {
    flex: 1,
    marginLeft: Spacing.md,
    gap: Spacing.xs,
  },
  skeletonTitle: {
    width: '60%',
    height: 14,
    borderRadius: 4,
    backgroundColor: Colors.surface,
  },
  skeletonSubtitle: {
    width: '40%',
    height: 12,
    borderRadius: 4,
    backgroundColor: Colors.surface,
  },
});
