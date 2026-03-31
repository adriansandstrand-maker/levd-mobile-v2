import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors, Fonts, Spacing, Radius, CategoryColors, QuickActionColors } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Avatar from '@/components/Avatar';
import CategoryRow from '@/components/CategoryRow';
import { categories, CategoryKey } from '@/constants/categories';

function getGreetingEmoji(): string {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? '☀️' : '🌙';
}

function getFirstName(user: any): string {
  const fullName = user?.user_metadata?.full_name || user?.email || 'bruker';
  return fullName.split(' ')[0];
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<CategoryKey, number>>({
    forsikringer: 0,
    kjoretoy: 0,
    helse: 0,
    familie: 0,
  });

  useEffect(() => {
    if (!user) return;

    async function fetchCounts() {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('category')
          .eq('user_id', user!.id);

        if (error || !data) return;

        const newCounts: Record<string, number> = {
          forsikringer: 0,
          kjoretoy: 0,
          helse: 0,
          familie: 0,
        };
        data.forEach((doc: any) => {
          if (doc.category && newCounts[doc.category] !== undefined) {
            newCounts[doc.category]++;
          }
        });
        setCounts(newCounts as Record<CategoryKey, number>);
      } catch {
        // silently fail
      }
    }

    fetchCounts();
  }, [user]);

  const fullName = user?.user_metadata?.full_name || user?.email || 'Bruker';
  const firstName = getFirstName(user);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Avatar name={fullName} size={52} />
            <View style={styles.headerText}>
              <Text style={styles.greeting}>
                Hei, {firstName} {getGreetingEmoji()}
              </Text>
              <Text style={styles.brand}>LEVD.AI</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconButton}>
              <FontAwesome name="sliders" size={20} color={Colors.text} />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <FontAwesome name="bell-o" size={20} color={Colors.text} />
              <View style={styles.notificationDot} />
            </Pressable>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickAction
            icon="file-text-o"
            label="Mine dok."
            colors={QuickActionColors.docs}
          />
          <QuickAction
            icon="search"
            label="Søk"
            colors={QuickActionColors.search}
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

        {/* Categories */}
        <Text style={styles.sectionTitle}>Kategorier</Text>
        {categories.map((cat) => (
          <CategoryRow
            key={cat.key}
            category={cat}
            count={counts[cat.key]}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({
  icon,
  label,
  colors,
}: {
  icon: string;
  label: string;
  colors: { bg: string; icon: string };
}) {
  return (
    <Pressable style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.7 }]}>
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
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.notification,
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
});
