import { Modal, Pressable, StyleSheet, View } from "react-native";
import { AppIcon } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";
import { t } from "../../i18n";
import { colors } from "../../theme";

type LogoutConfirmationSheetProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function LogoutConfirmationSheet({
  visible,
  onClose,
  onConfirm,
}: LogoutConfirmationSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetWrap}>
          <View style={styles.sheet}>
            <View style={styles.iconWrap}>
              <AppIcon name="logout" size={26} color="danger" />
            </View>

            <AppText style={styles.title}>{t("session.logoutTitle")}</AppText>
            <AppText style={styles.subtitle}>{t("session.logoutDesc")}</AppText>

            <View style={styles.actions}>
              <Pressable onPress={onClose} style={styles.cancelButton}>
                <AppText style={styles.cancelText}>{t("common.cancel")}</AppText>
              </Pressable>

              <Pressable onPress={onConfirm} style={styles.logoutButton}>
                <AppText style={styles.logoutText}>{t("session.logoutAction")}</AppText>
              </Pressable>
            </View>
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
    paddingHorizontal: 28,
  },
  sheet: {
    width: "100%",
    maxWidth: 390,
    borderRadius: 28,
    backgroundColor: colors.background,
    padding: 22,
    alignItems: "center",
  },
  iconWrap: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.dangerSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 21,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: "center",
  },
  actions: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textMuted,
  },
  logoutButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.inverseText,
  },
});
