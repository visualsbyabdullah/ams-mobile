import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { AppIcon } from "../../components/ui/AppIcon";
import { AppText } from "../../components/ui/AppText";
import {
  AuthUser,
  mockAuthUser,
  mockEmployeeCredentials,
} from "../../features/auth/mockAuth";
import { t } from "../../i18n";
import { colors, fontFamily } from "../../theme";

type LoginScreenProps = {
  onLogin: (user: AuthUser) => void;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState(mockEmployeeCredentials.email);
  const [password, setPassword] = useState(mockEmployeeCredentials.password);
  const [errorVisible, setErrorVisible] = useState(false);

  const submitLogin = () => {
    const emailMatches =
      email.trim().toLowerCase() === mockEmployeeCredentials.email;

    const passwordMatches = password === mockEmployeeCredentials.password;

    if (!emailMatches || !passwordMatches) {
      setErrorVisible(true);
      return;
    }

    setErrorVisible(false);
    onLogin(mockAuthUser);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <View style={styles.logoMark}>
          <AppIcon name="shield" size={34} color="inverseText" />
        </View>

        <AppText style={styles.welcome}>{t("auth.welcome")}</AppText>
        <AppText style={styles.title}>{t("auth.title")}</AppText>
        <AppText style={styles.subtitle}>{t("auth.subtitle")}</AppText>
      </View>

      <View style={styles.formCard}>
        <View style={styles.field}>
          <AppText style={styles.label}>{t("auth.email")}</AppText>

          <View style={styles.inputWrap}>
            <AppIcon name="mail" size={18} color="textMuted" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={t("auth.emailPlaceholder")}
              placeholderTextColor={colors.textSoft}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.field}>
          <AppText style={styles.label}>{t("auth.password")}</AppText>

          <View style={styles.inputWrap}>
            <AppIcon name="shield" size={18} color="textMuted" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={t("auth.passwordPlaceholder")}
              placeholderTextColor={colors.textSoft}
              secureTextEntry
              style={styles.input}
            />
          </View>
        </View>

        {errorVisible && (
          <View style={styles.errorBox}>
            <AppIcon name="x" size={16} color="danger" />
            <AppText style={styles.errorText}>
              {t("auth.invalidCredentials")}
            </AppText>
          </View>
        )}

        <Pressable onPress={submitLogin} style={styles.loginButton}>
          <AppText style={styles.loginButtonText}>{t("auth.login")}</AppText>
          <AppIcon name="chevronRight" size={18} color="inverseText" />
        </Pressable>

        <Pressable style={styles.forgotButton}>
          <AppText style={styles.forgotText}>{t("auth.forgotPassword")}</AppText>
        </Pressable>
      </View>

      <View style={styles.policyCard}>
        <View style={styles.policyIcon}>
          <AppIcon name="shield" size={18} color="accent" />
        </View>

        <View style={styles.policyText}>
          <AppText style={styles.policyTitle}>
            {t("auth.adminManagedTitle")}
          </AppText>
          <AppText style={styles.policyDesc}>
            {t("auth.adminManagedDesc")}
          </AppText>
        </View>
      </View>

      <View style={styles.demoCard}>
        <AppIcon name="shield" size={17} color="accent" />
        <AppText style={styles.demoText}>{t("auth.demoHint")}</AppText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    minHeight: "100%",
    paddingHorizontal: 20,
    paddingTop: 34,
    paddingBottom: 42,
    alignSelf: "center",
    width: "100%",
    maxWidth: 430,
    justifyContent: "center",
  },
  heroCard: {
    backgroundColor: colors.homeStatusBg,
    borderRadius: 30,
    padding: 22,
    alignItems: "center",
    marginBottom: 16,
  },
  logoMark: {
    width: 82,
    height: 82,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  welcome: {
    color: colors.homeStatusMutedText,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  title: {
    color: colors.inverseText,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    color: colors.homeStatusMutedText,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 16,
    gap: 14,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "800",
  },
  inputWrap: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    height: 52,
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.text,
  },
  errorBox: {
    borderRadius: 16,
    backgroundColor: colors.dangerSoft,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: colors.danger,
    fontSize: 13,
    fontWeight: "800",
  },
  loginButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 2,
  },
  loginButtonText: {
    color: colors.inverseText,
    fontSize: 15,
    fontWeight: "900",
  },
  forgotButton: {
    alignSelf: "center",
    paddingVertical: 4,
  },
  forgotText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "800",
  },
  policyCard: {
    marginTop: 16,
    borderRadius: 22,
    backgroundColor: colors.accentSoft,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  policyIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  policyText: {
    flex: 1,
  },
  policyTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 3,
  },
  policyDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  demoCard: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: colors.surface,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  demoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textMuted,
    fontWeight: "700",
  },
});
