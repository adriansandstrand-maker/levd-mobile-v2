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

const TIMEOUT_MS = 120_000;
const POLL_INTERVAL_MS = 2000;

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
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasStarted = useRef(false);

  const cleanup = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const startPolling = useCallback((docId: string) => {
    setState('analysing');

    timeoutRef.current = setTimeout(() => {
      cleanup();
      setErrorMessage('Analysen tok for lang tid. Prøv igjen.');
      setErrorCode('TIMEOUT');
      setState('error');
    }, TIMEOUT_MS);

    pollRef.current = setInterval(async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', docId)
        .single();

      if (error || !data) return;

      const doc = data as Document;

      if (doc.status === 'complete' || doc.status === 'failed') {
        cleanup();
        setDocument(doc);
        setState('result');
      }
    }, POLL_INTERVAL_MS);
  }, [cleanup]);

  useEffect(() => {
    if (hasStarted.current || !uri || !name || !mimeType || !user) return;
    hasStarted.current = true;

    (async () => {
      try {
        const result = await uploadDocument(uri, name, mimeType, user.id);
        documentIdRef.current = result.documentId;
        startPolling(result.documentId);
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

    return cleanup;
  }, [uri, name, mimeType, user, startPolling, cleanup]);

  const handleRetry = () => {
    hasStarted.current = false;
    setState('uploading');
    setErrorMessage('');
    setErrorCode('');
    // Re-trigger by resetting hasStarted — effect will re-run
    hasStarted.current = false;
    // Force re-run
    (async () => {
      if (!uri || !name || !mimeType || !user) return;
      hasStarted.current = true;
      try {
        const result = await uploadDocument(uri, name, mimeType, user.id);
        documentIdRef.current = result.documentId;
        startPolling(result.documentId);
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
      .update({ status: 'complete', category: 'annet', document_type: 'ukjent' })
      .eq('id', documentIdRef.current);
    router.replace({
      pathname: '/document/[id]',
      params: { id: documentIdRef.current },
    });
  };

  // Result view based on confidence
  if (state === 'result' && document) {
    const confidence = document.confidence ?? 0;

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
              suggestedCategory={(document.category || 'annet') as CategoryKey}
              documentName={document.document_type || document.file_name}
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
    if (confidence < 0.80 && document.status === 'complete') {
      router.replace({
        pathname: '/correct/[id]',
        params: { id: document.id },
      });
      return null;
    }

    // Failed status
    if (document.status === 'failed') {
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centered}>
            <View style={styles.errorCard}>
              <View style={[styles.iconCircle, { backgroundColor: '#EDDADB' }]}>
                <FontAwesome name="exclamation-triangle" size={24} color="#7E3535" />
              </View>
              <Text style={styles.errorTitle}>Analyse feilet</Text>
              <Text style={styles.errorSubtitle}>
                {document.analysis_error || 'Kunne ikke analysere dokumentet'}
              </Text>
              <View style={styles.errorActions}>
                <Pressable
                  style={({ pressed }) => [styles.button, styles.retryButton, pressed && styles.pressed]}
                  onPress={handleRetry}
                >
                  <FontAwesome name="refresh" size={16} color={Colors.white} />
                  <Text style={styles.retryText}>Prøv igjen</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.button, styles.saveButton, pressed && styles.pressed]}
                  onPress={handleSaveAnyway}
                >
                  <FontAwesome name="save" size={16} color={Colors.accent} />
                  <Text style={styles.saveText}>Lagre likevel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </SafeAreaView>
      );
    }
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
  saveButton: {
    backgroundColor: Colors.surface,
  },
  backButton: {
    backgroundColor: Colors.surface,
  },
  retryText: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 15,
    color: Colors.white,
  },
  saveText: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 15,
    color: Colors.accent,
  },
  backText: {
    fontFamily: Fonts.dmSansSemiBold,
    fontSize: 15,
    color: Colors.accent,
  },
});
