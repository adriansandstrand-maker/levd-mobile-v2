import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Fonts, Spacing, Radius } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { uploadDocument, UploadError } from '@/lib/upload';
import { supabase } from '@/lib/supabase';
import { Document } from '@/types';
import AnalysisLoader from '@/components/AnalysisLoader';
import ConfidenceCard from '@/components/ConfidenceCard';
import { CategoryKey } from '@/constants/categories';

type UploadState = 'uploading' | 'analysing' | 'result' | 'error';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://levd-ai.vercel.app';

export default function UploadScreen() {
  const { uri, name, mimeType } = useLocalSearchParams<{
    uri: string;
    name: string;
    mimeType: string;
  }>();
  const { user } = useAuth();
  const router = useRouter();

  const [state, setState] = useState<UploadState>('uploading');
  const [document, setDocument] = useState<Document | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorCode, setErrorCode] = useState<string>('');
  const documentIdRef = useRef<string | null>(null);
  const hasStarted = useRef(false);

  const analyseDocument = useCallback(async (docId: string) => {
    setState('analysing');
    try {
      const resp = await fetch(`${API_URL}/api/parse-document?mode=async`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        console.error('Analysis API error:', errText);
        setErrorMessage('AI-analysen feilet. Prøv igjen.');
        setErrorCode('ANALYSIS_FAILED');
        setState('error');
        return;
      }

      const result = await resp.json();

      if (result.success) {
        // Re-fetch the updated document
        const { data } = await supabase
          .from('documents')
          .select('*')
          .eq('id', docId)
          .single();

        if (data) {
          setDocument(data as Document);
          setState('result');
        } else {
          // API succeeded but can't fetch doc — just navigate
          router.replace({ pathname: '/document/[id]', params: { id: docId } });
        }
      } else {
        setErrorMessage(result.error || 'Analyse feilet');
        setErrorCode('ANALYSIS_FAILED');
        setState('error');
      }
    } catch (err) {
      console.error('Analysis fetch error:', err);
      setErrorMessage('Kunne ikke koble til analysesystemet');
      setErrorCode('NETWORK_ERROR');
      setState('error');
    }
  }, [router]);

  useEffect(() => {
    if (hasStarted.current || !uri || !name || !mimeType || !user) return;
    hasStarted.current = true;

    (async () => {
      try {
        const result = await uploadDocument(uri, name, mimeType, user.id);
        documentIdRef.current = result.documentId;
        await analyseDocument(result.documentId);
      } catch (err) {
        if (err instanceof UploadError) {
          setErrorMessage(err.message);
          setErrorCode(err.code);
        } else {
          setErrorMessage('En ukjent feil oppstod');
          setErrorCode('UNKNOWN');
        }
        setState('error');
      }
    })();
  }, [uri, name, mimeType, user, analyseDocument]);

  const handleRetry = () => {
    setState('uploading');
    setErrorMessage('');
    setErrorCode('');
    (async () => {
      if (!uri || !name || !mimeType || !user) return;
      try {
        // If we already have a document ID, just re-analyse
        if (documentIdRef.current) {
          await analyseDocument(documentIdRef.current);
        } else {
          const result = await uploadDocument(uri, name, mimeType, user.id);
          documentIdRef.current = result.documentId;
          await analyseDocument(result.documentId);
        }
      } catch (err) {
        if (err instanceof UploadError) {
          setErrorMessage(err.message);
          setErrorCode(err.code);
        } else {
          setErrorMessage('En ukjent feil oppstod');
          setErrorCode('UNKNOWN');
        }
        setState('error');
      }
    })();
  };

  const handleSaveAnyway = async () => {
    if (!documentIdRef.current) return;
    await supabase
      .from('documents')
      .update({ category: 'other', title: 'ukjent' })
      .eq('id', documentIdRef.current);
    router.replace({
      pathname: '/document/[id]',
      params: { id: documentIdRef.current },
    });
  };

  // Result view — the analysis API sets category/title on the document
  if (state === 'result' && document) {
    const metadata = document.metadata as Record<string, any> | null;
    const confidence = metadata?.confidence ?? 0;

    // High confidence — auto-navigate
    if (confidence >= 0.95) {
      router.replace({
        pathname: '/document/[id]',
        params: { id: document.id },
      });
      return null;
    }

    // Medium confidence — show ConfidenceCard
    if (confidence >= 0.80) {
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centered}>
            <ConfidenceCard
              confidence={confidence}
              suggestedCategory={(document.category || 'other') as CategoryKey}
              documentName={document.title || document.file_name}
              onConfirm={() => {
                router.replace({
                  pathname: '/document/[id]',
                  params: { id: document.id },
                });
              }}
              onCorrect={() => {
                router.replace({
                  pathname: '/correct/[id]',
                  params: { id: document.id },
                });
              }}
            />
          </View>
        </SafeAreaView>
      );
    }

    // Low confidence — redirect to correction
    router.replace({
      pathname: '/correct/[id]',
      params: { id: document.id },
    });
    return null;
  }

  // Error state
  if (state === 'error') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <View style={styles.errorCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#EDDADB' }]}>
              <FontAwesome name="exclamation-triangle" size={24} color="#7E3535" />
            </View>
            <Text style={styles.errorTitle}>
              {errorCode === 'FILE_TOO_LARGE'
                ? 'Filen er for stor'
                : errorCode === 'INVALID_FILE_TYPE'
                ? 'Ugyldig filtype'
                : errorCode === 'TIMEOUT'
                ? 'Tidsavbrudd'
                : 'Opplasting feilet'}
            </Text>
            <Text style={styles.errorSubtitle}>{errorMessage}</Text>
            <View style={styles.errorActions}>
              <Pressable
                style={({ pressed }) => [styles.button, styles.retryButton, pressed && styles.pressed]}
                onPress={handleRetry}
              >
                <FontAwesome name="refresh" size={16} color={Colors.white} />
                <Text style={styles.retryText}>Prøv igjen</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.button, styles.backButton, pressed && styles.pressed]}
                onPress={() => router.back()}
              >
                <Text style={styles.backText}>Tilbake</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Loading states (uploading / analysing)
  return (
    <SafeAreaView style={styles.safeArea}>
      <AnalysisLoader />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  errorCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  errorTitle: {
    fontFamily: Fonts.dmSansBold,
    fontSize: 18,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontFamily: Fonts.dmSans,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  errorActions: {
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
  retryButton: {
    backgroundColor: Colors.accent,
  },
  backButton: {
    backgroundColor: Colors.surface,
  },
  retryText: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 15,
    color: Colors.white,
  },
  backText: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 15,
    color: Colors.accent,
  },
});
