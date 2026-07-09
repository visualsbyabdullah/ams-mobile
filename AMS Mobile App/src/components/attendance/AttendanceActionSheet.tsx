import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  canUseDeviceAttendance,
  canUseFieldAttendance,
  canUseRemoteAttendance,
} from "../../features/policies/guards";
import { ResolvedPolicy } from "../../features/policies/types";
import { t } from "../../i18n";
import { colors } from "../../theme";
import { AppIcon } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";

type AttendanceActionSheetProps = {
  visible: boolean;
  policy: ResolvedPolicy;
  onClose: () => void;
};

type ActionMode = "device" | "remote" | "field" | "unavailable";

function RequirementRow({
  icon,
  title,
  description,
}: {
  icon: "shield" | "location" | "user";
  title: string;
  description: string;
}) {
  return (
    <View style={styles.requirementRow}>
      <View style={styles.requirementIcon}>
        <AppIcon name={icon} size={18} color="accent" />
      </View>

      <View style={styles.requirementText}>
        <AppText style={styles.requirementTitle}>{title}</AppText>
        <AppText style={styles.requirementDesc}>{description}</AppText>
      </View>

      <AppIcon name="check" size={18} color="accent" />
    </View>
  );
}

export function AttendanceActionSheet({
  visible,
  policy,
  onClose,
}: AttendanceActionSheetProps) {
  const [submitted, setSubmitted] = useState(false);
  const [actionType, setActionType] = useState<"checkIn" | "checkOut">(
    "checkIn"
  );

  const mode: ActionMode = canUseRemoteAttendance(policy)
    ? "remote"
    : canUseFieldAttendance(policy)
      ? "field"
      : canUseDeviceAttendance(policy)
        ? "device"
        : "unavailable";

  const closeSheet = () => {
    setSubmitted(false);
    setActionType("checkIn");
    onClose();
  };

  const submit = (type: "checkIn" | "checkOut") => {
    setActionType(type);
    setSubmitted(true);
  };

  const title =
    mode === "remote"
      ? t("attendanceFlow.remoteTitle")
      : mode === "field"
        ? t("attendanceFlow.fieldTitle")
        : mode === "device"
          ? t("attendanceFlow.onsiteBlockedTitle")
          : t("attendanceFlow.unavailable");

  const subtitle =
    mode === "remote"
      ? t("attendanceFlow.remoteDesc")
      : mode === "field"
        ? t("attendanceFlow.fieldDesc")
        : mode === "device"
          ? t("attendanceFlow.onsiteBlockedDesc")
          : t("attendanceFlow.unavailableDesc");

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={closeSheet}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={closeSheet} />

        <View style={styles.sheetWrap}>
          <View style={styles.sheet}>
            <View style={styles.handle} />

            {submitted ? (
              <View style={styles.successWrap}>
                <View style={styles.successIcon}>
                  <AppIcon name="check" size={30} color="inverseText" />
                </View>

                <AppText style={styles.successTitle}>
                  {t("attendanceFlow.savedTitle")}
                </AppText>

                <AppText style={styles.successDesc}>
                  {actionType === "checkIn"
                    ? t("attendanceFlow.checkInSavedDesc")
                    : t("attendanceFlow.checkOutSavedDesc")}
                </AppText>

                <Pressable onPress={closeSheet} style={styles.primaryButton}>
                  <AppText style={styles.primaryButtonText}>
                    {t("common.done")}
                  </AppText>
                </Pressable>
              </View>
            ) : (
              <>
                <View style={styles.header}>
                  <View style={styles.headerLeft}>
                    <View style={styles.headerIcon}>
                      <AppIcon name="clock" size={20} color="accent" />
                    </View>

                    <View style={styles.headerText}>
                      <AppText style={styles.title}>
                        {t("attendanceFlow.markTitle")}
                      </AppText>
                      <AppText style={styles.subtitle}>
                        {t("attendanceFlow.markSubtitle")}
                      </AppText>
                    </View>
                  </View>

                  <Pressable onPress={closeSheet} style={styles.closeButton}>
                    <AppIcon name="x" size={20} color="textMuted" />
                  </Pressable>
                </View>

                <ScrollView
                  style={styles.scroll}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.statusCard}>
                    <View style={styles.statusIcon}>
                      <AppIcon
                        name={mode === "field" ? "location" : "shield"}
                        size={18}
                        color="inverseText"
                      />
                    </View>

                    <View style={styles.statusText}>
                      <AppText style={styles.statusTitle}>{title}</AppText>
                      <AppText style={styles.statusSubtitle}>{subtitle}</AppText>
                    </View>
                  </View>

                  {mode === "device" && (
                    <View style={styles.noteCard}>
                      <AppIcon name="shield" size={17} color="accent" />
                      <AppText style={styles.noteText}>
                        {t("attendanceFlow.deviceSyncNote")}
                      </AppText>
                    </View>
                  )}

                  {(mode === "remote" || mode === "field") && (
                    <>
                      <View style={styles.section}>
                        <AppText style={styles.sectionTitle}>
                          {t("attendanceFlow.requirements")}
                        </AppText>

                        <View style={styles.card}>
                          {policy.attendance.remoteAttendance.requiresFaceVerification && (
                            <RequirementRow
                              icon="user"
                              title={t("attendanceFlow.faceVerification")}
                              description={t("attendanceFlow.faceVerificationDesc")}
                            />
                          )}

                          {mode === "field" &&
                            policy.attendance.fieldAttendance.requiresLocation && (
                              <RequirementRow
                                icon="location"
                                title={t("attendanceFlow.locationProof")}
                                description={t("attendanceFlow.locationProofDesc")}
                              />
                            )}

                          {mode === "field" &&
                            policy.attendance.fieldAttendance.requiresSelfie && (
                              <RequirementRow
                                icon="user"
                                title={t("attendanceFlow.selfieProof")}
                                description={t("attendanceFlow.selfieProofDesc")}
                              />
                            )}
                        </View>
                      </View>

                      <View style={styles.noteCard}>
                        <AppIcon name="shield" size={17} color="accent" />
                        <AppText style={styles.noteText}>
                          {t("attendanceFlow.policyNote")}
                        </AppText>
                      </View>

                      <View style={styles.actions}>
                        <Pressable
                          onPress={() => submit("checkIn")}
                          style={styles.primaryButton}
                        >
                          <AppText style={styles.primaryButtonText}>
                            {t("attendanceFlow.checkIn")}
                          </AppText>
                        </Pressable>

                        <Pressable
                          onPress={() => submit("checkOut")}
                          style={styles.secondaryButton}
                        >
                          <AppText style={styles.secondaryButtonText}>
                            {t("attendanceFlow.checkOut")}
                          </AppText>
                        </Pressable>
                      </View>
                    </>
                  )}
                </ScrollView>
              </>
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
    paddingHorizontal: 18,
    paddingVertical: 34,
  },
  sheet: {
    width: "100%",
    maxWidth: 430,
    height: "78%",
    backgroundColor: colors.background,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 8,
    overflow: "hidden",
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
    marginBottom: 14,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  statusCard: {
    backgroundColor: colors.homeStatusBg,
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.inverseText,
    marginBottom: 3,
  },
  statusSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.homeStatusMutedText,
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 14,
    gap: 12,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  requirementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  requirementText: {
    flex: 1,
  },
  requirementTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 2,
  },
  requirementDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  noteCard: {
    marginTop: 18,
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
  actions: {
    marginTop: 18,
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.inverseText,
  },
  secondaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textMuted,
  },
  successWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },
  successDesc: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: "center",
  },
});
