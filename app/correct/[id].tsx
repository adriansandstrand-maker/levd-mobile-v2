import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Fonts, Spacing, Radius, CategoryColors } from '@/lib/theme';
import { supabase } from '@/lib/supabase';
import { Document } from '@/types';

interface DocTypeOption {
  key: string;
  label: string;
}

interface CategoryGroup {
  key: string;
  label: string;
  icon: string;
  colors: { bg: string; icon: string };
  types: DocTypeOption[];
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    key: 'insurance',
    label: 'Forsikringer',
    icon: 'shield',
    colors: CategoryColors.insurance,
    types: [
      { key: 'bilforsikring', label: 'Bilforsikring' },
      { key: 'batforsikring', label: 'Båtforsikring' },
      { key: 'husforsikring', label: 'Husforsikring' },
      { key: 'innboforsikring', label: 'Innboforsikring' },
      { key: 'reiseforsikring', label: 'Reiseforsikring' },
      { key: 'livsforsikring', label: 'Livsforsikring' },
      { key: 'helseforsikring', label: 'Helseforsikring' },
      { key: 'ulykkesforsikring', label: 'Ulykkesforsikring' },
    ],
  },
  {
    key: 'contract',
    label: 'Kontrakter',
    icon: 'file-text-o',
    colors: CategoryColors.contract,
    types: [
      { key: 'arbeidskontrakt', label: 'Arbeidskontrakt' },
      { key: 'leiekontrakt', label: 'Leiekontrakt' },
      { key: 'kjopskontrakt', label: 'Kjøpskontrakt' },
      { key: 'samboerkontrakt', label: 'Samboerkontrakt' },
      { key: 'abonnementsavtale', label: 'Abonnementsavtale' },
      { key: 'kjopskontrakt_eiendom', label: 'Kjøpskontrakt eiendom' },
      { key: 'kjopskontrakt_kjoretoy', label: 'Kjøpskontrakt kjøretøy' },
    ],
  },
  {
    key: 'loan',
    label: 'Lån',
    icon: 'bank',
    colors: CategoryColors.loan,
    types: [
      { key: 'lanedokument', label: 'Lånedokument' },
      { key: 'skattemelding', label: 'Skattemelding' },
      { key: 'lonnslipp', label: 'Lønnsslipp' },
      { key: 'kontoutskrift', label: 'Kontoutskrift' },
      { key: 'arsoppgave', label: 'Årsoppgave' },
    ],
  },
  {
    key: 'receipt',
    label: 'Kvitteringer',
    icon: 'credit-card',
    colors: CategoryColors.receipt,
    types: [
      { key: 'kvittering', label: 'Kvittering' },
      { key: 'garantibevis', label: 'Garantibevis' },
      { key: 'service_kvittering', label: 'Servicekvittering' },
    ],
  },
  {
    key: 'identification',
    label: 'ID-dokumenter',
    icon: 'id-card',
    colors: CategoryColors.identification,
    types: [
      { key: 'pass', label: 'Pass' },
      { key: 'nasjonal_id', label: 'Nasjonalt ID-kort' },
      { key: 'fodselssattest', label: 'Fødselsattest' },
      { key: 'forerkort', label: 'Førerkort' },
    ],
  },
  {
    key: 'medical',
    label: 'Helse',
    icon: 'heartbeat',
    colors: CategoryColors.medical,
    types: [
      { key: 'helsejournal', label: 'Helsejournal' },
      { key: 'legeerklaring', label: 'Legeerklæring' },
      { key: 'resept', label: 'Resept' },
      { key: 'sykemelding', label: 'Sykemelding' },
      { key: 'vaksinasjon', label: 'Vaksinasjon' },
      { key: 'tannlege', label: 'Tannlege' },
    ],
  },
  {
    key: 'legal',
    label: 'Juridisk',
    icon: 'balance-scale',
    colors: CategoryColors.legal,
    types: [
      { key: 'testament', label: 'Testament' },
      { key: 'ektepakt', label: 'Ektepakt' },
      { key: 'fullmakt', label: 'Fullmakt' },
      { key: 'barnebidrag', label: 'Barnebidrag' },
      { key: 'dom', label: 'Dom' },
      { key: 'skjote', label: 'Skjøte' },
      { key: 'byggetillatelse', label: 'Byggetillatelse' },
      { key: 'takstrapport', label: 'Takstrapport' },
    ],
  },
  {
    key: 'educational',
    label: 'Utdanning',
    icon: 'graduation-cap',
    colors: CategoryColors.educational,
    types: [
      { key: 'karakterutskrift', label: 'Karakterutskrift' },
      { key: 'vitnemal', label: 'Vitnemål' },
      { key: 'kursbevis', label: 'Kursbevis' },
      { key: 'studentbevis', label: 'Studentbevis' },
    ],
  },
  {
    key: 'drawing',
    label: 'Tegninger',
    icon: 'paint-brush',
    colors: CategoryColors.drawing,
    types: [
      { key: 'tegning', label: 'Tegning' },
      { key: 'barnetegning', label: 'Barnetegning' },
    ],
  },
  {
    key: 'other',
    label: 'Annet',
    icon: 'folder-o',
    colors: CategoryColors.other,
    types: [
      { key: 'vognkort', label: 'Vognkort' },
      { key: 'eu_kontroll', label: 'EU-kontroll' },
      { key: 'vigselsattest', label: 'Vigselsattest' },
      { key: 'ukjent', label: 'Ukjent' },
    ],
  },
];

export default function CorrectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();
      if (data) {
        setDocument(data as Document);
        setSelectedType(data.title);
        setSelectedCategory(data.category);
      }
      setLoading(false);
    })();
  }, [id]);

  const handleSelectType = (categoryKey: string, typeKey: string) => {
    setSelectedCategory(categoryKey);
    setSelectedType(typeKey);
  };

  const handleSave = async () => {
    if (!id || !selectedType || !selectedCategory) return;
    setSaving(true);
    await supabase
      .from('documents')
      .update({
        title: selectedType,
        category: selectedCategory,
      })
      .eq('id', id);
    router.replace({
      pathname: '/document/[id]',
      params: { id },
    });
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={18} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Velg dokumenttype</Text>
        <View style={styles.backButton} />
      </View>

      {document && (
        <Text style={styles.fileName}>{document.file_name}</Text>
      )}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {CATEGORY_GROUPS.map((group) => (
          <View key={group.key} style={styles.group}>
            <View style={styles.groupHeader}>
              <View style={[styles.groupIcon, { backgroundColor: group.colors.bg }]}>
                <FontAwesome name={group.icon as any} size={16} color={group.colors.icon} />
              </View>
              <Text style={styles.groupLabel}>{group.label}</Text>
            </View>
            <View style={styles.typeGrid}>
              {group.types.map((type) => {
                const isSelected = selectedType === type.key && selectedCategory === group.key;
                return (
                  <Pressable
                    key={type.key}
                    style={({ pressed }) => [
                      styles.typeChip,
                      isSelected && styles.typeChipSelected,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => handleSelectType(group.key, type.key)}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        isSelected && styles.typeChipTextSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            (!selectedType || saving) && styles.saveButtonDisabled,
            pressed && styles.pressed,
          ]}
          onPress={handleSave}
          disabled={!selectedType || saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <FontAwesome name="check" size={16} color={Colors.white} />
              <Text style={styles.saveButtonText}>Lagre</Text>
            </>
          )}
        </Pressable>
      </View>
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
  fileName: {
    fontFamily: Fonts.jetBrainsMono,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  group: {
    marginBottom: Spacing.lg,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  groupIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  groupLabel: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 16,
    color: Colors.text,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeChip: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  typeChipSelected: {
    backgroundColor: Colors.accent,
  },
  typeChipText: {
    fontFamily: Fonts.dmSansMedium,
    fontSize: 14,
    color: Colors.text,
  },
  typeChipTextSelected: {
    color: Colors.white,
  },
  pressed: {
    opacity: 0.7,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 16,
    color: Colors.white,
  },
});
