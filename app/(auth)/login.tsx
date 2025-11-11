import { ensureProfile } from "@/lib/profile";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { EyeToggle } from "../../components/EyeToggle";
import { supabase } from "../../lib/supabase";
import { palette } from "../../lib/theme";
import { validateEmail, validatePassword } from "../../lib/validation";

export default function Login() {
  // ------------------ logic (unchanged) ------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);

  const emailOk = validateEmail(email);
  const pwdOk = validatePassword(password);
  const formOk = emailOk && pwdOk;

  const signIn = async () => {
    if (!formOk) return;
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      await ensureProfile();
      router.replace("/(tabs)/feed");
    } catch (e: any) {
      Alert.alert("Login failed", e.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // -------------------------------------------------------

  const { width } = Dimensions.get("window");
  const isWide = width >= 900;

  // Light theme palette
  const light = useMemo(
    () => ({
      bg: "#ffffff",
      ink: "#0f172a",
      sub: "#6b7280",
      border: "#e5e7eb",
      surface: "#f8fafc",
      purple: palette.purple,
      teal: "#10b981",
    }),
    []
  );

  // ---- stable style objects ----
  const styles = useMemo<any>(
    () => ({
      container: {
        flex: 1,
        backgroundColor: light.bg,
      },
      scroll: {
        minHeight: "100%",
        padding: 24,
        paddingVertical: isWide ? 48 : 24,
        justifyContent: "center",
        backgroundColor: light.bg,
      },
      card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: light.border,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        overflow: "hidden",
        flexDirection: isWide ? "row" : "column",
      },
      left: { flex: 1, padding: isWide ? 36 : 22 },
      right: {
        flex: 1,
        backgroundColor: "#f0fdf9",
        padding: isWide ? 36 : 24,
        justifyContent: "center",
        borderTopWidth: isWide ? 0 : 1,
        borderLeftWidth: isWide ? 1 : 0,
        borderColor: light.border,
      },
      label: { color: light.sub, fontSize: 12, marginBottom: 6 },
      input: {
        color: light.ink,
        borderWidth: 1,
        borderColor: light.border,
        backgroundColor: "#fff",
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 12,
      },
      fieldWrap: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: light.border,
        borderRadius: 12,
        backgroundColor: "#fff",
        paddingHorizontal: 12,
      },
      dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 16,
      },
      dividerLine: {
        height: 1,
        backgroundColor: light.border,
        flex: 1,
      },
      dividerText: {
        color: light.sub,
        marginHorizontal: 12,
        fontSize: 12,
      },
    }),
    [light, isWide]
  );

  // ---- helper subcomponents declared once ----
  const Divider = () => (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>or</Text>
      <View style={styles.dividerLine} />
    </View>
  );

  const Label = ({ children }: { children: string }) => (
    <Text style={styles.label}>{children}</Text>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.card}>
          <View style={styles.left}>
            <Text style={{ color: light.ink, fontSize: 28, fontWeight: "800" }}>
              Welcome back
            </Text>
            <Text style={{ color: light.sub, marginTop: 4, marginBottom: 16 }}>
              Enter your credentials to access your account.
            </Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: light.surface,
                  borderWidth: 1,
                  borderColor: light.border,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: light.ink, fontWeight: "700" }}>
                  Continue with Google
                </Text>
              </Pressable>
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: light.surface,
                  borderWidth: 1,
                  borderColor: light.border,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: light.ink, fontWeight: "700" }}>
                  Continue with Apple
                </Text>
              </Pressable>
            </View>

            <Divider />

            <Label>Email address</Label>
            <TextInput
              placeholder='you@company.com'
              placeholderTextColor={light.sub}
              autoCapitalize='none'
              keyboardType='email-address'
              value={email}
              onChangeText={setEmail}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              style={[
                styles.input,
                !emailOk && touched.email && { borderColor: "#ef4444" },
              ]}
            />
            {!emailOk && touched.email && (
              <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>
                Enter a valid email (e.g., you@domain.com)
              </Text>
            )}

            <View style={{ height: 12 }} />
            <Label>Password</Label>
            <View
              style={[
                styles.fieldWrap,
                !pwdOk && touched.password && { borderColor: "#ef4444" },
              ]}
            >
              <TextInput
                style={{ flex: 1, color: light.ink, paddingVertical: 12 }}
                placeholder='min 6 chars'
                placeholderTextColor={light.sub}
                secureTextEntry={!showPwd}
                value={password}
                onChangeText={setPassword}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              />
              <EyeToggle
                visible={showPwd}
                onPress={() => setShowPwd((v) => !v)}
                color={light.sub}
              />
            </View>
            {!pwdOk && touched.password && (
              <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>
                Password must be at least 6 characters.
              </Text>
            )}

            <Pressable
              onPress={signIn}
              disabled={!formOk || loading}
              style={{
                opacity: !formOk || loading ? 0.6 : 1,
                backgroundColor: light.purple,
                padding: 16,
                borderRadius: 12,
                alignItems: "center",
                marginTop: 14,
                shadowColor: light.purple,
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 3,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800" }}>
                {loading ? "..." : "Login"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(auth)/signup")}
              style={{ paddingVertical: 14 }}
            >
              <Text style={{ color: light.ink, textAlign: "center" }}>
                New to Framez?{" "}
                <Text
                  style={{
                    color: light.purple,
                    textDecorationLine: "underline",
                  }}
                >
                  Create an account
                </Text>
              </Text>
            </Pressable>
          </View>
          <View style={styles.right}>
            <View
              style={{
                backgroundColor: "#e0e7ff",
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: "#c7d2fe",
              }}
            >
              <Text
                style={{ color: light.ink, fontSize: 18, fontWeight: "800" }}
              >
                The simplest way to share your frames
              </Text>
              <Text style={{ color: light.sub, marginTop: 6 }}>
                Clean feed, quick posts, and a neat profile—built with real-time
                Supabase.
              </Text>
            </View>

            <View style={{ marginTop: 16, gap: 12 }}>
              <View
                style={{
                  height: 90,
                  backgroundColor: "#ffffff",
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: light.border,
                }}
              />
              <View
                style={{
                  height: 60,
                  backgroundColor: "#ffffff",
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: light.border,
                }}
              />
            </View>

            <View
              style={{
                height: 6,
                backgroundColor: light.teal,
                borderRadius: 999,
                width: "40%",
                marginTop: 18,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
