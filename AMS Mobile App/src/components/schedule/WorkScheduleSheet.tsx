import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { AppIcon } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";
import {
  canUseBreakTracking,
  canUseDeviceAttendance,
  canUseRemoteAttendance,
  getWorkingDays,
} from "../../features/policies/guards";
import { ResolvedPolicy } from "../../features/policies/types";
import { getSalaryBasisLabelKey } from "../../features/payroll/calculatePayroll";
import { t } from "../../i18n";
import { colors } from "../../theme";

type WorkScheduleSheetProps = {
  visible: boolean;
  policy: ResolvedPolicy;
  onClose: () => void;
};

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: "calendar" | "clock" | "shield" | "salary";
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <AppIcon name={icon} size={18} color="accent" />
      </View>

      <View style={styles.infoText}>
        <AppText style={styles.infoLabel}>{label}</AppText>
        <AppText style={styles.infoValue}>{value}</AppText>
      </View>
    </View>
  );
}

export function WorkScheduleSheet({
  visible,
  policy,
  onClose,
}: WorkScheduleSheetProps) {
  const workingDays = getWorkingDays(policy);

  const attendanceSource = canUseDeviceAttendance(policy)
    ? t("schedule.deviceAttendance")
    : canUseRemoteAttendance(policy)
      ? t("schedule.remoteAttendance")
      : t("schedule.attendanceNotEnabled");

  const overtimeStatus = policy.payroll.overtime.enabled
    ? t("schedule.overtimeEnabled")
    : t("schedule.overtimeDisabled");

  const breakStatus = canUseBreakTracking(policy)
    ? t("common.enabled")
    : t("common.disabled");

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
                  <AppIcon name="calendar" size={20} color="accent" />
                </View>

                <View style={styles.headerText}>
                  <AppText style={styles.title}>{t("schedule.title")}</AppText>
                  <AppText style={styles.subtitle}>{t("schedule.subtitle")}</AppText>
                </View>
              </View>

              <Pressable onPress={onClose} style={styles.closeButton}>
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
                  <AppIcon name="shield" size={18} color="inverseText" />
                </View>

                <View style={styles.statusTextWrap}>
                  <AppText style={styles.statusTitle}>
                    {t("schedule.resolvedPolicy")}
                  </AppText>
                  <AppText style={styles.statusSubtitle}>
                    {t("schedule.resolvedPolicyDesc")}
                  </AppText>
                </View>
              </View>

              <View style={styles.section}>
                <AppText style={styles.sectionTitle}>
                  {t("schedule.workingDays")}
                </AppText>

                <View style={styles.daysGrid}>
                  {workingDays.map((day) => (
                    <View key={day} style={styles.dayPill}>
                      <AppText style={styles.dayText}>{t(`days.${day}`)}</AppText>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <AppText style={styles.sectionTitle}>
                  {t("schedule.shiftAndAttendance")}
                </AppText>

                <View style={styles.card}>
                  <InfoRow
                    icon="clock"
                    label={t("schedule.shiftTime")}
                    value={`${policy.schedule.defaultShift.start} - ${policy.schedule.defaultShift.end}`}
                  />
                  <InfoRow
                    icon="shield"
                    label={t("schedule.attendanceSource")}
                    value={attendanceSource}
                  />
                  <InfoRow
                    icon="clock"
                    label={t("schedule.breakTracking")}
                    value={breakStatus}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <AppText style={styles.sectionTitle}>
                  {t("schedule.payrollRules")}
                </AppText>

                <View style={styles.card}>
                  <InfoRow
                    icon="salary"
                    label={t("payroll.salaryBasis")}
                    value={t(getSalaryBasisLabelKey(policy.payroll.salaryCalculationBasis))}
                  />
                  <InfoRow
                    icon="clock"
                    label={t("schedule.requiredMonthlyHours")}
                    value={`${policy.payroll.requiredMonthlyHours}`}
                  />
                  <InfoRow
                    icon="clock"
                    label={t("schedule.overtime")}
                    value={overtimeStatus}
                  />
                  <InfoRow
                    icon="clock"
                    label={t("schedule.maxOvertime")}
                    value={`${policy.payroll.overtime.maxHoursPerDay} ${t("common.hours")}`}
                  />
                </View>
              </View>

              <View style={styles.noteCard}>
                <AppIcon name="shield" size={17} color="accent" />
                <AppText style={styles.noteText}>
                  {t("schedule.note")}
                </AppText>
              </View>
            </ScrollView>
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
    height: "82%",
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
    marginBottom: 10,
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statusTextWrap: {
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
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  dayPill: {
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  dayText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.accent,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 14,
    gap: 12,
  },
  infoRow: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
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
});
