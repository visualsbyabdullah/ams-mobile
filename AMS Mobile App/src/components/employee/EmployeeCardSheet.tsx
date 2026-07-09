import { Modal, Pressable, StyleSheet, View } from "react-native";
import { AppIcon } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";
import { employeeProfile } from "../../features/profile/mockProfile";
import { t } from "../../i18n";
import { colors } from "../../theme";

type EmployeeCardSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function EmployeeCardSheet({
  visible,
  onClose,
}: EmployeeCardSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetWrap}>
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIcon}>
                  <AppIcon name="badge" size={20} color="accent" />
                </View>

                <View style={styles.headerText}>
                  <AppText style={styles.title}>{t("employeeCard.title")}</AppText>
                  <AppText style={styles.subtitle}>{t("employeeCard.subtitle")}</AppText>
                </View>
              </View>

              <Pressable onPress={onClose} style={styles.closeButton}>
                <AppIcon name="x" size={20} color="textMuted" />
              </Pressable>
            </View>

            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.avatar}>
                  <AppIcon name="user" size={36} color="inverseText" />
                </View>

                <View style={styles.verifiedBadge}>
                  <AppIcon name="shield" size={17} color="accent" />
                </View>
              </View>

              <AppText style={styles.employeeName}>{employeeProfile.name}</AppText>
              <AppText style={styles.employeeRole}>{employeeProfile.designation}</AppText>

              <View style={styles.idPill}>
                <AppText style={styles.idText}>{employeeProfile.employeeId}</AppText>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoGrid}>
                <View style={styles.infoBox}>
                  <AppText style={styles.infoLabel}>{t("profile.department")}</AppText>
                  <AppText style={styles.infoValue}>{employeeProfile.department}</AppText>
                </View>

                <View style={styles.infoBox}>
                  <AppText style={styles.infoLabel}>{t("profile.branch")}</AppText>
                  <AppText style={styles.infoValue}>{employeeProfile.branch}</AppText>
                </View>

                <View style={styles.infoBox}>
                  <AppText style={styles.infoLabel}>{t("profile.joiningDate")}</AppText>
                  <AppText style={styles.infoValue}>{employeeProfile.joiningDate}</AppText>
                </View>

                <View style={styles.infoBox}>
                  <AppText style={styles.infoLabel}>{t("profile.phone")}</AppText>
                  <AppText style={styles.infoValue}>{employeeProfile.phone}</AppText>
                </View>
              </View>

              <View style={styles.qrBox}>
                <View style={styles.qrInner}>
                  <AppIcon name="badge" size={42} color="accent" />
                </View>
                <AppText style={styles.qrText}>{t("employeeCard.qrText")}</AppText>
              </View>
            </View>

            <View style={styles.noteCard}>
              <AppIcon name="shield" size={17} color="accent" />
              <AppText style={styles.noteText}>{t("employeeCard.note")}</AppText>
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
    paddingHorizontal: 18,
    paddingVertical: 34,
  },
  sheet: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: colors.background,
    borderRadius: 28,
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
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textMuted,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.homeStatusBg,
    borderRadius: 28,
    padding: 20,
    alignItems: "center",
  },
  cardTop: {
    width: "100%",
    alignItems: "center",
    position: "relative",
    marginBottom: 14,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedBadge: {
    position: "absolute",
    right: 96,
    bottom: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  employeeName: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.inverseText,
  },
  employeeRole: {
    marginTop: 4,
    fontSize: 13,
    color: colors.homeStatusMutedText,
  },
  idPill: {
    marginTop: 14,
    borderRadius: 999,
    backgroundColor: colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  idText: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.inverseText,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: colors.homeStatusMutedText,
    marginVertical: 18,
  },
  infoGrid: {
    width: "100%",
    gap: 10,
  },
  infoBox: {
    borderRadius: 18,
    backgroundColor: colors.surface,
    padding: 13,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "800",
  },
  qrBox: {
    width: "100%",
    marginTop: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    padding: 16,
    alignItems: "center",
  },
  qrInner: {
    width: 82,
    height: 82,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  qrText: {
    marginTop: 10,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "700",
  },
  noteCard: {
    marginTop: 14,
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
});
