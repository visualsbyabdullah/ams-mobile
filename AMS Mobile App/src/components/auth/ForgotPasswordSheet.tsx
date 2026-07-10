import { useState } from "react";
import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";

import { sendPasswordResetEmail } from "../../features/auth/employeeAuthService";
import { t } from "../../i18n";
import { colors } from "../../theme";
import { AppIcon } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";

type ForgotPasswordSheetProps = {
  visible: boolean;
  email: string;
  onClose: () => void;
};

export const ForgotPasswordSheet = ({
  visible,
  email,
  onClose,
}: ForgotPasswordSheetProps) => {
  const [resetEmail, setResetEmail] = useState(email);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setResetEmail(email);
    setSending(false);
    setSent(false);
    setError(null);
    onClose();
  };

  const handleSendReset = async () => {
    setSending(true);
    setError(null);
    setSent(false);

    try {
      await sendPasswordResetEmail(resetEmail);
      setSent(true);
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : t("auth.resetEmailFailed")
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={handleClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <AppIcon name="mail" size={20} color="accent" />
            </View>

            <View style={styles.headerText}>
              <AppText style={styles.title}>{t("auth.forgotTitle")}</AppText>
              <AppText style={styles.subtitle}>
                {t("auth.forgotSubtitle")}
              </AppText>
            </View>

            <Pressable onPress={handleClose} style={styles.closeButton}>
              <AppIcon name="x" size={18} color="textMuted" />
            </Pressable>
          </View>

          <View style={styles.field}>
            <AppText style={styles.label}>{t("auth.email")}</AppText>

            <View style={styles.inputWrap}>
              <AppIcon name="mail" size={18} color="textMuted" />
              <TextInput
                value={resetEmail}
                onChangeText={setResetEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder={t("auth.emailPlaceholder")}
                placeholderTextColor={colors.textSoft}
                style={styles.input}
              />
            </View>
          </View>

          {sent && (
            <View style={styles.successBox}>
              <AppIcon name="check" size={16} color="accent" />
              <AppText style={styles.successText}>
                {t("auth.resetEmailSent")}
              </AppText>
            </View>
          )}

          {error && (
            <View style={styles.errorBox}>
              <AppIcon name="x" size={16} color="danger" />
              <AppText style={styles.errorText}>{error}</AppText>
            </View>
          )}

          <Pressable
            onPress={handleSendReset}
            disabled={sending || !resetEmail.trim()}
            style={[
              styles.primaryButton,
              (sending || !resetEmail.trim()) && styles.primaryButtonDisabled,
            ]}
          >
            <AppText style={styles.primaryButtonText}>
              {sending ? t("auth.sendingResetEmail") : t("auth.sendResetEmail")}
            </AppText>
          </Pressable>

          <AppText style={styles.note}>
            {t("auth.resetEmailNote")}
          </AppText>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.backdrop,
    justifyContent: "flex-end",
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 34,
  },
  handle: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  inputWrap: {
    minHeight: 52,
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    borderWidth: 0,
    outlineStyle: "none",
    outlineWidth: 0,
  },
  successBox: {
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  successText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: colors.accent,
    fontWeight: "700",
  },
  errorBox: {
    borderRadius: 18,
    backgroundColor: colors.dangerSoft,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: colors.danger,
    fontWeight: "700",
  },
  primaryButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
    color: colors.inverseText,
  },
  note: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 12,
  },
});
