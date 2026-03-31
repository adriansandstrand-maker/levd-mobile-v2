import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Fonts, Spacing, Radius } from '@/lib/theme';
import { useAuth } from '@/lib/auth';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Fyll inn e-post og passord');
      return;
    }
    if (isSignUp && !name.trim()) {
      setError('Fyll inn navn');
      return;
    }

    setLoading(true);
    setError(null);

    const result = isSignUp
      ? await signUp(email.trim(), password, name.trim())
      : await signIn(email.trim(), password);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.brand}>LEVD.AI</Text>
        <Text style={styles.title}>
          {isSignUp ? 'Opprett konto' : 'Logg inn'}
        </Text>
        <Text style={styles.subtitle}>
          {isSignUp
            ? 'Kom i gang med å organisere dokumentene dine'
            : 'Velkommen tilbake'}
        </Text>

        {error && <Text style={styles.error}>{error}</Text>}

        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Fullt navn"
            placeholderTextColor={Colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="E-post"
          placeholderTextColor={Colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Passord"
          placeholderTextColor={Colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>
              {isSignUp ? 'Opprett konto' : 'Logg inn'}
            </Text>
          )}
        </Pressable>

        <Pressable onPress={() => { setIsSignUp(!isSignUp); setError(null); }}>
          <Text style={styles.switchText}>
            {isSignUp
              ? 'Har du allerede en konto? Logg inn'
              : 'Ny bruker? Opprett konto'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  brand: {
    fontFamily: Fonts.jetBrainsMono,
    fontSize: 14,
    color: Colors.textSecondary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontFamily: Fonts.dmSansBold,
    fontSize: 28,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: Fonts.dmSans,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  error: {
    fontFamily: Fonts.dmSans,
    fontSize: 14,
    color: Colors.notification,
    textAlign: 'center',
    marginBottom: Spacing.md,
    backgroundColor: '#FFF0ED',
    padding: Spacing.sm,
    borderRadius: Radius.sm,
  },
  input: {
    fontFamily: Fonts.dmSans,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontFamily: Fonts.dmSansBold,
    fontSize: 16,
    color: Colors.white,
  },
  switchText: {
    fontFamily: Fonts.dmSansMedium,
    fontSize: 14,
    color: Colors.accent,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
