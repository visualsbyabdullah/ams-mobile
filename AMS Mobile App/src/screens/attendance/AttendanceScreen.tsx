import { ScrollView, StyleSheet, View } from "react-native";
import { AppIcon } from "../../components/ui/AppIcon";
import { AppText } from "../../components/ui/AppText";
import {
  attendanceHistory,
  monthlyAttendanceSummary,
  todayAttendance,
} from "../../features/attendance/mockAttendance";
import {
  canUseBreakTracking,
  canUseDeviceAttendance,
  canUseFieldAttendance,
  canUseRemoteAttendance,
} from "../../features/policies/guards";
import { ResolvedPolicy } from "../../features/policies/types";
import { t } from "../../i18n";
import { colors } from "../../theme";

type AttendanceScreenProps = {
  policy: ResolvedPolicy;
};

export function AttendanceScreen({ policy }: AttendanceScreenProps) {
  const deviceAttendanceEnabled = canUseDeviceAttendance(policy);
  const remoteAttendanceEnabled = canUseRemoteAttendance(policy);
  const fieldAttendanceEnabled = canUseFieldAttendance(policy);
  const breakTrackingEnabled = canUseBreakTracking(policy);

  const isRemoteMode =
    todayAttendance.mode === "remote" && remoteAttendanceEnabled;

  const isFieldMode =
    todayAttendance.mode === "field" && fieldAttendanceEnabled;

  const isOnsiteMode =
    todayAttendance.mode === "onsite" && deviceAttendanceEnabled;

  const modeTitle = isRemoteMode
    ? t("attendance.remoteMode")
    : isFieldMode
      ? t("attendance.fieldMode")
      : t("attendance.onsiteMode");

  const modeDescription = isRemoteMode
    ? t("attendance.remoteCheckIn")
    : isFieldMode
      ? t("attendance.fieldCheckIn")
      : t("attendance.deviceSync");

  const showMobileAttendanceActions = isRemoteMode || isFieldMode;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topRow}>
        <View>
          <AppText style={styles.screenTitle}>{t("attendance.title")}</AppText>
          <AppText style={styles.screenSubtitle}>{t("attendance.subtitle")}</AppText>
        </View>

        <View style={styles.headerIcon}>
          <AppIcon name="clock" size={20} color="accent" />
        </View>
      </View>

      <View style={styles.statusPill}>
        <View style={styles.statusIconWrap}>
          <AppIcon
            name={isRemoteMode ? "laptop" : isFieldMode ? "work" : "shield"}
            size={17}
            color="inverseText"
          />
        </View>

        <View style={styles.statusTextWrap}>
          <AppText style={styles.statusTitle}>{modeTitle}</AppText>
          <AppText style={styles.statusSubtitle}>{modeDescription}</AppText>
        </View>
      </View>

      <View style={styles.todayCard}>
        <View style={styles.cardHeader}>
          <View>
            <AppText style={styles.cardTitle}>{t("attendance.todayAttendance")}</AppText>
            <AppText style={styles.cardSubtitle}>
              {t("attendance.shiftTime")}: {todayAttendance.shiftStart} -{" "}
              {todayAttendance.shiftEnd}
            </AppText>
          </View>

          <View style={styles.syncBadge}>
            <AppIcon name="clock" size={14} color="accent" />
            <AppText style={styles.syncText}>
              {todayAttendance.lastSync}
            </AppText>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <AppText style={styles.metricLabel}>
              {t("attendance.expectedHours")}
            </AppText>
            <AppText style={styles.metricValue}>
              {todayAttendance.expectedHours}
            </AppText>
          </View>

          <View style={styles.metricBoxMuted}>
            <AppText style={styles.metricLabel}>
              {t("common.totalHours")}
            </AppText>
            <AppText style={styles.metricValueMuted}>
              {todayAttendance.totalHours}
            </AppText>
          </View>
        </View>

        {showMobileAttendanceActions ? (
          <View style={styles.checkRow}>
            <View style={[styles.checkBox, styles.checkInBox]}>
              <AppText style={styles.checkLabel}>{t("common.checkIn")}</AppText>
              <AppText style={styles.checkValue}>
                {todayAttendance.checkIn || t("attendance.unavailable")}
              </AppText>
            </View>

            <View style={styles.checkBox}>
              <AppText style={styles.checkLabel}>{t("common.checkOut")}</AppText>
              <AppText style={styles.checkValueMuted}>
                {todayAttendance.checkOut || t("attendance.unavailable")}
              </AppText>
            </View>
          </View>
        ) : (
          <View style={styles.noticeBox}>
            <View style={styles.noticeIcon}>
              <AppIcon name="shield" size={16} color="accent" />
            </View>
            <AppText style={styles.noticeText}>
              {isOnsiteMode
                ? t("attendance.noMobileAction")
                : t("attendance.deviceSync")}
            </AppText>
          </View>
        )}

        {isRemoteMode && (
          <View style={styles.noticeBox}>
            <View style={styles.noticeIconOrange}>
              <AppIcon name="user" size={16} color="orange" />
            </View>
            <AppText style={styles.noticeText}>
              {t("attendance.faceRequired")}
            </AppText>
          </View>
        )}

        {isFieldMode && (
          <View style={styles.noticeBox}>
            <View style={styles.noticeIconOrange}>
              <AppIcon name="location" size={16} color="orange" />
            </View>
            <AppText style={styles.noticeText}>
              {t("attendance.locationRequired")}
            </AppText>
          </View>
        )}
      </View>

      {breakTrackingEnabled && (
        <>
          <View style={styles.sectionHead}>
            <AppText style={styles.sectionTitle}>{t("attendance.breakTracking")}</AppText>
          </View>

          <View style={styles.breakCard}>
            <View style={styles.breakHeader}>
              <View>
                <AppText style={styles.breakTitle}>{t("attendance.breakTracking")}</AppText>
                <AppText style={styles.breakSubtitle}>
                  {t("attendance.breakTrackingDesc")}
                </AppText>
              </View>

              <View style={styles.breakIcon}>
                <AppIcon name="clock" size={18} color="orange" />
              </View>
            </View>

            <View style={styles.breakRow}>
              <View style={styles.breakAction}>
                <AppText style={styles.breakActionTitle}>{t("common.breakIn")}</AppText>
                <AppText style={styles.breakActionSubtitle}>
                  {t("attendance.unavailable")}
                </AppText>
              </View>

              <View style={styles.breakAction}>
                <AppText style={styles.breakActionTitle}>{t("common.breakOut")}</AppText>
                <AppText style={styles.breakActionSubtitle}>
                  {t("attendance.unavailable")}
                </AppText>
              </View>
            </View>
          </View>
        </>
      )}

      <View style={styles.sectionHead}>
        <AppText style={styles.sectionTitle}>{t("attendance.monthlySummary")}</AppText>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <AppText style={styles.summaryValueAccent}>
            {monthlyAttendanceSummary.present}
          </AppText>
          <AppText style={styles.summaryLabel}>{t("common.present")}</AppText>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <AppText style={styles.summaryValueOrange}>
            {monthlyAttendanceSummary.late}
          </AppText>
          <AppText style={styles.summaryLabel}>{t("common.late")}</AppText>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <AppText style={styles.summaryValueDanger}>
            {monthlyAttendanceSummary.absent}
          </AppText>
          <AppText style={styles.summaryLabel}>{t("common.absent")}</AppText>
        </View>
      </View>

      <View style={styles.sectionHeadWithAction}>
        <AppText style={styles.sectionTitle}>{t("attendance.history")}</AppText>
        <AppText style={styles.monthText}>July 2026</AppText>
      </View>

      <View style={styles.historyCard}>
        <View style={styles.tableHeader}>
          <AppText style={[styles.tableHeaderText, styles.dateCol]}>
            {t("common.date")}
          </AppText>
          <AppText style={[styles.tableHeaderText, styles.timeCol]}>
            {t("common.checkIn")}
          </AppText>
          <AppText style={[styles.tableHeaderText, styles.timeCol]}>
            {t("common.checkOut")}
          </AppText>
          <AppText style={[styles.tableHeaderText, styles.hoursCol]}>
            {t("common.hours")}
          </AppText>
        </View>

        {attendanceHistory.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <AppText style={[styles.tableDate, styles.dateCol]}>
              {item.date}
            </AppText>

            <AppText style={[styles.tableText, styles.timeCol]}>
              {item.checkIn}
            </AppText>

            <AppText
              style={[
                item.status === "weekend"
                  ? styles.weekendText
                  : styles.tableText,
                styles.timeCol,
              ]}
            >
              {item.status === "weekend"
                ? t("attendance.weekend")
                : item.checkOut}
            </AppText>

            <AppText
              style={[
                item.status === "present"
                  ? styles.hoursText
                  : styles.tableText,
                styles.hoursCol,
              ]}
            >
              {item.hours}
            </AppText>
          </View>
        ))}

        <View style={styles.totalBar}>
          <AppIcon name="clock" size={17} color="inverseText" />
          <AppText style={styles.totalBarLabel}>{t("common.totalHours")}</AppText>
          <AppText style={styles.totalBarValue}>
            {monthlyAttendanceSummary.totalHours}
          </AppText>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 140,
    alignSelf: "center",
    width: "100%",
    maxWidth: 430,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  screenTitle: {
    fontSize: 30,
    lineHeight: 36,
    color: colors.text,
    fontWeight: "800",
  },
  screenSubtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: {
    backgroundColor: colors.homeStatusBg,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  statusIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statusTextWrap: {
    flex: 1,
  },
  statusTitle: {
    color: colors.inverseText,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  statusSubtitle: {
    color: colors.homeStatusMutedText,
    fontSize: 13,
    lineHeight: 18,
  },
  todayCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
  },
  syncBadge: {
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  syncText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.homeProgressTrack,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFill: {
    width: "48%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.homeCheckInBg,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  metricBoxMuted: {
    flex: 1,
    backgroundColor: colors.homeCheckOutBg,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  metricLabel: {
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.textMuted,
    fontWeight: "700",
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  metricValueMuted: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textSoft,
  },
  checkRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  checkBox: {
    flex: 1,
    backgroundColor: colors.homeCheckOutBg,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  checkInBox: {
    backgroundColor: colors.homeCheckInBg,
  },
  checkLabel: {
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.textMuted,
    fontWeight: "700",
    marginBottom: 6,
  },
  checkValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  checkValueMuted: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textSoft,
  },
  noticeBox: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  noticeIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  noticeIconOrange: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.orangeSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  sectionHead: {
    marginBottom: 12,
  },
  sectionHeadWithAction: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  monthText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.accent,
  },
  breakCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    marginBottom: 24,
  },
  breakHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  breakTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  breakSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  breakIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.orangeSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  breakRow: {
    flexDirection: "row",
    gap: 10,
  },
  breakAction: {
    flex: 1,
    backgroundColor: colors.orangeSoft,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  breakActionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  breakActionSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    height: 42,
    backgroundColor: colors.border,
  },
  summaryValueAccent: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.accent,
    marginBottom: 4,
  },
  summaryValueOrange: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.orange,
    marginBottom: 4,
  },
  summaryValueDanger: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.danger,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textMuted,
  },
  tableRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  dateCol: {
    flex: 1,
  },
  timeCol: {
    flex: 1.2,
    textAlign: "center",
  },
  hoursCol: {
    flex: 0.8,
    textAlign: "right",
  },
  tableDate: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },
  tableText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  weekendText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textMuted,
  },
  hoursText: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.accent,
  },
  totalBar: {
    backgroundColor: colors.homeStatusBg,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  totalBarLabel: {
    color: colors.inverseText,
    fontSize: 14,
    fontWeight: "800",
  },
  totalBarValue: {
    color: colors.inverseText,
    fontSize: 15,
    fontWeight: "900",
  },
});
