import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';

import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { ready, error, hasAccount, isAuthenticated, createAccount, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setFeedback('Masukkan alamat email yang valid.');
      return;
    }

    if (password.length < 8) {
      setFeedback('Kata sandi harus terdiri dari minimal 8 karakter.');
      return;
    }

    if (!hasAccount && password !== confirmPassword) {
      setFeedback('Konfirmasi kata sandi belum sama.');
      return;
    }

    setSubmitting(true);
    setFeedback('');

    try {
      if (hasAccount) {
        const valid = await signIn(normalizedEmail, password, rememberMe);
        if (!valid) {
          setFeedback('Email atau kata sandi salah.');
          return;
        }
      } else {
        await createAccount(normalizedEmail, password, rememberMe);
      }

      router.replace('/(tabs)/dashboard');
    } catch {
      setFeedback('Login gagal diproses. Periksa penyimpanan perangkat dan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loading]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memeriksa akun...</Text>
      </SafeAreaView>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.heroCircleLarge} />
            <View style={styles.heroCircleSmall} />

            <View style={styles.brandRow}>
              <View style={styles.logoTile}>
                <Image
                  source={require('../../assets/images/assettrack-logo.png')}
                  resizeMode="contain"
                  accessibilityLabel="Logo Asset Track"
                  style={styles.logo}
                />
              </View>
              <View>
                <Text style={styles.brandName}>Asset Track</Text>
                <Text style={styles.brandCaption}>OFFICE ASSET MANAGEMENT</Text>
              </View>
            </View>

            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>Aset kantor, lebih mudah terpantau.</Text>
              <Text style={styles.heroSubtitle}>
                {hasAccount
                  ? 'Masuk untuk mengelola inventaris dengan lebih praktis.'
                  : 'Buat akun administrator untuk mulai mengelola inventaris.'}
              </Text>
            </View>
            <View style={styles.heroAccent}>
              <Ionicons name="cube-outline" size={18} color="#FFFFFF" />
              <Text style={styles.heroAccentText}>Kelola. Pantau. Tertata.</Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.formHeading}>
              <Text style={styles.formTitle}>
                {hasAccount ? 'Selamat datang' : 'Buat akun administrator'}
              </Text>
              <Text style={styles.formSubtitle}>
                {hasAccount
                  ? 'Masukkan detail akun Anda untuk melanjutkan.'
                  : 'Akun ini disimpan secara lokal di perangkat ini.'}
              </Text>
            </View>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={19}
                color={COLORS.muted}
                style={styles.inputIcon}
              />
              <TextInput
                value={email}
                onChangeText={value => {
                  setEmail(value);
                  setFeedback('');
                }}
                placeholder="nama@perusahaan.com"
                placeholderTextColor="#A0A9B6"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                returnKeyType="next"
                accessibilityLabel="Email"
                style={styles.input}
              />
            </View>

            <View style={styles.passwordLabelRow}>
              <Text style={styles.label}>Kata sandi</Text>
              {!hasAccount && (
                <Text style={styles.passwordHint}>Minimal 8 karakter</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color={COLORS.muted}
                style={styles.inputIcon}
              />
              <TextInput
                value={password}
                onChangeText={value => {
                  setPassword(value);
                  setFeedback('');
                }}
                placeholder="Masukkan kata sandi"
                placeholderTextColor="#A0A9B6"
                secureTextEntry={!passwordVisible}
                maxLength={128}
                autoCapitalize="none"
                autoComplete={hasAccount ? 'current-password' : 'new-password'}
                returnKeyType={hasAccount ? 'done' : 'next'}
                onSubmitEditing={hasAccount ? () => void submit() : undefined}
                accessibilityLabel="Kata sandi"
                style={styles.input}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={passwordVisible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                onPress={() => setPasswordVisible(value => !value)}
                hitSlop={10}
                style={styles.visibilityButton}
              >
                <Ionicons
                  name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={19}
                  color={COLORS.muted}
                />
              </Pressable>
            </View>

            {!hasAccount && (
              <>
                <Text style={styles.label}>Konfirmasi kata sandi</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={19}
                    color={COLORS.muted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={value => {
                      setConfirmPassword(value);
                      setFeedback('');
                    }}
                    placeholder="Ulangi kata sandi"
                    placeholderTextColor="#A0A9B6"
                    secureTextEntry={!passwordVisible}
                    maxLength={128}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    returnKeyType="done"
                    onSubmitEditing={() => void submit()}
                    accessibilityLabel="Konfirmasi kata sandi"
                    style={styles.input}
                  />
                </View>
              </>
            )}

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
              onPress={() => setRememberMe(value => !value)}
              style={styles.rememberRow}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && (
                  <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.rememberText}>Ingat saya</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={submitting || !!error}
              onPress={() => void submit()}
              style={({ pressed }) => [
                styles.submitButton,
                (pressed || submitting) && styles.submitButtonPressed
              ]}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>
                    {hasAccount ? 'Masuk' : 'Buat akun dan masuk'}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </>
              )}
            </Pressable>

            {!!(feedback || error) && (
              <Text
                accessibilityLiveRegion="polite"
                style={styles.feedback}
              >
                {feedback || error}
              </Text>
            )}

            <View style={styles.secureNote}>
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color={COLORS.green}
              />
              <Text style={styles.secureNoteText}>
                Kata sandi disimpan dalam bentuk hash di perangkat ini.
              </Text>
            </View>
          </View>

          <Text style={styles.footer}>
            Asset Track <Text style={styles.footerDot}>•</Text> Kelola inventaris dengan praktis
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 12
  },
  flex: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24
  },
  hero: {
    minHeight: 250,
    backgroundColor: COLORS.navy,
    borderRadius: 26,
    padding: 22,
    justifyContent: 'space-between',
    overflow: 'hidden'
  },
  heroCircleLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FFFFFF0C',
    top: -90,
    right: -60
  },
  heroCircleSmall: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFFFFF0A',
    bottom: -78,
    right: 38
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoTile: {
    width: 62,
    height: 62,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13
  },
  logo: {
    width: 51,
    height: 48
  },
  brandName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  brandCaption: {
    fontSize: 8,
    letterSpacing: 1.1,
    color: '#C9D8F0',
    marginTop: 4
  },
  heroCopy: {
    marginTop: 25,
    marginBottom: 20
  },
  heroTitle: {
    maxWidth: 290,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  heroSubtitle: {
    maxWidth: 300,
    fontSize: 13,
    lineHeight: 19,
    color: '#D4E0F2',
    marginTop: 8
  },
  heroAccent: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    backgroundColor: '#FFFFFF18',
    paddingHorizontal: 11,
    paddingVertical: 7
  },
  heroAccentText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 7
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 21,
    marginTop: 16,
    shadowColor: '#1A2B45',
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3
  },
  formHeading: {
    marginBottom: 22
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text
  },
  formSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.muted,
    marginTop: 5
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8
  },
  inputContainer: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    backgroundColor: '#FBFCFE',
    marginBottom: 17
  },
  inputIcon: {
    marginLeft: 14
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: COLORS.text,
    fontSize: 14,
    paddingVertical: 13,
    paddingHorizontal: 11
  },
  passwordLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  passwordHint: {
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 8
  },
  visibilityButton: {
    paddingHorizontal: 13,
    paddingVertical: 10
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 2,
    marginBottom: 19
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#C7D0DE',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  rememberText: {
    fontSize: 12,
    color: COLORS.muted
  },
  submitButton: {
    minHeight: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  submitButtonPressed: {
    opacity: 0.86
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginRight: 9
  },
  feedback: {
    color: COLORS.orange,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 12
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 15,
    marginTop: 17
  },
  secureNoteText: {
    flexShrink: 1,
    color: COLORS.muted,
    fontSize: 10,
    marginLeft: 7
  },
  footer: {
    color: COLORS.muted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 16
  },
  footerDot: {
    color: COLORS.primary
  }
});
