import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors, Fonts, Spacing, Radius } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import Avatar from '@/components/Avatar';

const menuItems = [
  { icon: 'user-o', label: 'Min konto' },
  { icon: 'users', label: 'Familie og deling' },
  { icon: 'bell-o', label: 'Varslinger' },
  { icon: 'lock', label: 'Sikkerhet' },
] as const;

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const fullName = user?.user_metadata?.full_name || 'Bruker';
  const email = user?.email || '';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileHeader}>
          <Avatar name={fullName} size={72} />
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}
            >
              <View style={styles.menuIconContainer}>
                <FontAwesome name={item.icon as any} size={18} color={Colors.accent} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <FontAwesome name="chevron-right" size={14} color={Colors.textSecondary} />
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutPressed]}
          onPress={signOut}
        >
          <FontAwesome name="sign-out" size={18} color={Colors.notification} />
          <Text style={styles.logoutText}>Logg ut</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  name: {
    fontFamily: Fonts.dmSansBold,
    fontSize: 22,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  email: {
    fontFamily: Fonts.dmSans,
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  menuSection: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuRowPressed: {
    backgroundColor: Colors.surface,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontFamily: Fonts.dmSansMedium,
    fontSize: 16,
    color: Colors.text,
    marginLeft: Spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  logoutPressed: {
    opacity: 0.7,
  },
  logoutText: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 16,
    color: Colors.notification,
  },
});
