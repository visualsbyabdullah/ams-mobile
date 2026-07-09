import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { AppIcon } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";
import { t } from "../../i18n";
import { colors } from "../../theme";

type ForgotPasswordSheetProps = {
  visible: boolean;
  email: string;
  onClose: () => void;
};

export function ForgotPasswordSheet({
  visible,
  email,
  onClose,
}: ForgotPasswordSheetProps) {
  const [sent, setSent] = useState(false);

  const closeSheet = () => {
    setSent(false);
    onClose();
  };

  const registeredEmail = email.trim() || t("auth.registeredEmailFallback");

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={closeSheet}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={closeSheet} />

        <View style={styles.sheetWrap}>
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.iconWrap}>
              <AppIcon name={sent ? "check" : "mail"} size={26} color="accent" />
            </View>

            <AppText style={styles.title}>
              {sent ? t("auth.resetEmailSentTitle") : t("auth.forgotSheetTitle")}
            </AppText>

            <AppText style={styles.subtitle}>
              {sent ? t("auth.resetEmailSentDesc") : t("auth.forgotSheetDesc")}
            </AppText>

            <View style={styles.emailCard}>
              <View style={styles.emailIcon}>
                <AppIcon name="mail" size={18} color="accent" />
              </View>

              <View style={styles.emailText}>
                <AppText style={styles.emailLabel}>
                  {t("auth.registeredEmail")}
                </AppText>
                <AppText style={styles.emailValue}>{registeredEmail}</AppText>
              </View>
            </View>

            <View style={styles.noteCard}>
              <AppIcon name="shield" size={17} color="accent" />
              <AppText style={styles.noteText}>
                {sent ? t("auth.resetEmailSentNote") : t("auth.forgotSheetNote")}
              </AppText>
            </View>

            {sent ? (
              <Pressable onPress={closeSheet} style={styles.doneButton}>
                <AppText style={styles.doneButtonText}>{t("common.done")}</AppText>
              </Pressable>
            ) : (
              <Pressable onPress={() => setSent(true)} style={styles.doneButton}>
                <AppText style={styles.doneButtonText}>
                  {t("auth.sendResetEmail")}
                </AppText>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.overlay,
  },
  sheetWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 34,
  },
  sheet: {
    width: "100%",
    maxWidth: 390,
    borderRadius: 28,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: 18,
  },
  iconWrap: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 18,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: "center",
  },
  emailCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  emailIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  emailText: {
    flex: 1,
  },
  emailLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 3,
  },
  emailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "800",
  },
  noteCard: {
    marginTop: 6,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  doneButton: {
    marginTop: 16,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  doneButtonText: {
    color: colors.inverseText,
    fontSize: 14,
    fontWeight: "900",
  },
});
