import { useState } from "react";
import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";

import { updateRecoveryPassword } from "../../features/auth/employeeAuthService";
import { t } from "../../i18n";
import { colors } from "../../theme";
import { AppIcon } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";

type ResetPasswordSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export const ResetPasswordSheet = ({
  visible,
  onClose,
}: ResetPasswordSheetProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setPassword("");
    setConfirmPassword("");
    setPasswordVisible(false);
    setConfirmVisible(false);
    setSaving(false);
    setDone(false);
    setError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      if (password.length < 6) {
        throw new Error(t("auth.passwordTooShort"));
      }

      if (password !== confirmPassword) {
        throw new Error(t("auth.passwordMismatch"));
      }

      await updateRecoveryPassword(password);
      setDone(true);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : t("auth.passwordUpdateFailed")
      );
    } finally {
      setSaving(false);
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
              <AppIcon name="lock" size={20} color="accent" />
            </View>

            <View style={styles.headerText}>
              <AppText style={styles.title}>{t("auth.resetPasswordTitle")}</AppText>
              <AppText style={styles.subtitle}>
                {t("auth.resetPasswordSubtitle")}
              </AppText>
            </View>

            <Pressable onPress={handleClose} style={styles.closeButton}>
              <AppIcon name="x" size={18} color="textMuted" />
            </Pressable>
          </View>

          {!done && (
            <>
              <View style={styles.field}>
                <AppText style={styles.label}>{t("auth.newPassword")}</AppText>

                <View style={styles.inputWrap}>
                  <AppIcon name="lock" size={18} color="textMuted" />

                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                    placeholder={t("auth.newPasswordPlaceholder")}
                    placeholderTextColor={colors.textSoft}
                    style={styles.input}
                  />

                  <Pressable
                    onPress={() => setPasswordVisible((current) => !current)}
                    style={styles.eyeButton}
                  >
                    <AppIcon
                      name={passwordVisible ? "eyeOff" : "eye"}
                      size={18}
                      color="textMuted"
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.field}>
                <AppText style={styles.label}>{t("auth.confirmPassword")}</AppText>

                <View style={styles.inputWrap}>
                  <AppIcon name="lock" size={18} color="textMuted" />

                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!confirmVisible}
                    placeholder={t("auth.confirmPasswordPlaceholder")}
                    placeholderTextColor={colors.textSoft}
                    style={styles.input}
                  />

                  <Pressable
                    onPress={() => setConfirmVisible((current) => !current)}
                    style={styles.eyeButton}
                  >
                    <AppIcon
                      name={confirmVisible ? "eyeOff" : "eye"}
                      size={18}
                      color="textMuted"
                    />
                  </Pressable>
                </View>
              </View>

              {error && (
                <View style={styles.errorBox}>
                  <AppIcon name="x" size={16} color="danger" />
                  <AppText style={styles.errorText}>{error}</AppText>
                </View>
              )}

              <Pressable
                onPress={handleSave}
                disabled={saving || !password || !confirmPassword}
                style={[
                  styles.primaryButton,
                  (saving || !password || !confirmPassword) &&
                    styles.primaryButtonDisabled,
                ]}
              >
                <AppText style={styles.primaryButtonText}>
                  {saving ? t("auth.updatingPassword") : t("auth.updatePassword")}
                </AppText>
              </Pressable>
            </>
          )}

          {done && (
            <>
              <View style={styles.successBox}>
                <AppIcon name="check" size={16} color="accent" />
                <AppText style={styles.successText}>
                  {t("auth.passwordUpdated")}
                </AppText>
              </View>

              <Pressable onPress={handleClose} style={styles.primaryButton}>
                <AppText style={styles.primaryButtonText}>
                  {t("common.done")}
                </AppText>
              </Pressable>
            </>
          )}
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
    minHeight: 54,
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
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
  eyeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
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
});
