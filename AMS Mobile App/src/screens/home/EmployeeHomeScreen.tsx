import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { AppIcon, IconName } from "../../components/ui/AppIcon";
import { AppText } from "../../components/ui/AppText";
import {
  canRequestWfh,
  isModuleEnabled,
} from "../../features/policies/guards";
import { ResolvedPolicy } from "../../features/policies/types";
import { t } from "../../i18n";
import { colors } from "../../theme";

type EmployeeHomeScreenProps = {
  policy: ResolvedPolicy;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
};

type SnapshotTone = "accent" | "orange" | "info";

type SnapshotItem = {
  key: string;
  titleKey: string;
  subtitleKey: string;
  value: string;
  icon: IconName;
  tone: SnapshotTone;
};

type ToneStyle = {
  iconBg: keyof typeof colors;
  iconColor: keyof typeof colors;
  valueColor: keyof typeof colors;
};

const snapshotItems: SnapshotItem[] = [
  {
    key: "leave",
    titleKey: "home.leaveBalance",
    subtitleKey: "home.daysAvailable",
    value: "12",
    icon: "calendar",
    tone: "accent",
  },
  {
    key: "requests",
    titleKey: "home.pendingRequests",
    subtitleKey: "home.awaitingReview",
    value: "03",
    icon: "request",
    tone: "orange",
  },
  {
    key: "salary",
    titleKey: "home.thisMonthSalary",
    subtitleKey: "home.estimatedDate",
    value: "25 Jul",
    icon: "salary",
    tone: "info",
  },
  {
    key: "attendance",
    titleKey: "home.attendanceRate",
    subtitleKey: "home.currentMonth",
    value: "98%",
    icon: "check",
    tone: "accent",
  },
];

const toneStyles: Record<SnapshotTone, ToneStyle> = {
  accent: {
    iconBg: "accentSoft",
    iconColor: "accent",
    valueColor: "accent",
  },
  orange: {
    iconBg: "orangeSoft",
    iconColor: "orange",
    valueColor: "orange",
  },
  info: {
    iconBg: "infoSoft",
    iconColor: "info",
    valueColor: "info",
  },
};

export function EmployeeHomeScreen({
  policy,
  onMenuPress,
  onNotificationPress,
}: EmployeeHomeScreenProps) {
  const notificationsEnabled = isModuleEnabled(policy, "notifications");
  const wfhEnabled = canRequestWfh(policy);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topRow}>
        <Pressable onPress={onMenuPress} style={styles.circleButton}>
          <AppIcon name="menu" size={20} color="text" />
        </Pressable>

        <View style={styles.topRight}>
          {notificationsEnabled && (
            <Pressable onPress={onNotificationPress} style={styles.circleButton}>
              <AppIcon name="bell" size={18} color="text" />
              <View style={styles.notificationDot} />
            </Pressable>
          )}

          <View style={styles.avatarButton}>
            <AppIcon name="user" size={18} color="inverseText" />
          </View>
        </View>
      </View>

      <View style={styles.heroBlock}>
        <AppText style={styles.heroGreeting}>{t("home.greeting")}</AppText>
        <AppText style={styles.heroTitle}>{t("home.title")}</AppText>
      </View>

      <View style={styles.statusPill}>
        <View style={styles.statusIconWrap}>
          <AppIcon name="clock" size={16} color="inverseText" />
        </View>

        <View style={styles.statusTextWrap}>
          <AppText style={styles.statusTitle}>{t("home.statusTitle")}</AppText>
          <AppText style={styles.statusSubtitle}>
            {t("home.statusMessage")}
          </AppText>
        </View>
      </View>

      <View style={styles.attendanceCard}>
        <View style={styles.attendanceHeader}>
          <View>
            <AppText style={styles.cardTitle}>{t("home.attendanceTitle")}</AppText>
            <AppText style={styles.cardSubtitle}>
              {t("home.shiftTime")}: {policy.schedule.defaultShift.start} -{" "}
              {policy.schedule.defaultShift.end}
            </AppText>
          </View>

          <Pressable style={styles.arrowButton}>
            <AppIcon name="chevronRight" size={18} color="textMuted" />
          </Pressable>
        </View>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <View style={styles.checkRow}>
          <View style={[styles.checkBox, styles.checkInBox]}>
            <AppText style={styles.checkLabel}>{t("home.checkInLabel")}</AppText>
            <AppText style={styles.checkValue}>09:08</AppText>
          </View>

          <View style={styles.checkBox}>
            <AppText style={styles.checkLabel}>{t("home.checkOutLabel")}</AppText>
            <AppText style={styles.checkValueMuted}>--:--</AppText>
          </View>
        </View>

        {wfhEnabled && (
          <AppText style={styles.footNote}>
            {t("home.wfhLockedUntilApproval")}
          </AppText>
        )}
      </View>

      <View style={styles.sectionHead}>
        <AppText style={styles.sectionTitle}>{t("home.workSnapshot")}</AppText>
      </View>

      <View style={styles.snapshotList}>
        {snapshotItems.map((item) => {
          const tone = toneStyles[item.tone];

          return (
            <View key={item.key} style={styles.snapshotCard}>
              <View
                style={[
                  styles.snapshotIconWrap,
                  { backgroundColor: colors[tone.iconBg] },
                ]}
              >
                <AppIcon
                  name={item.icon}
                  size={18}
                  color={tone.iconColor}
                />
              </View>

              <View style={styles.snapshotTextWrap}>
                <AppText style={styles.snapshotTitle}>
                  {t(item.titleKey)}
                </AppText>
                <AppText style={styles.snapshotSubtitle}>
                  {t(item.subtitleKey)}
                </AppText>
              </View>

              <AppText
                style={[
                  styles.snapshotValue,
                  { color: colors[tone.valueColor] },
                ]}
              >
                {item.value}
              </AppText>
            </View>
          );
        })}
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
    marginBottom: 22,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.homeActionBg,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.homeAvatarBg,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.homeNotificationDot,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  heroBlock: {
    marginBottom: 18,
  },
  heroGreeting: {
    fontSize: 28,
    lineHeight: 34,
    color: colors.text,
    fontWeight: "700",
  },
  heroTitle: {
    maxWidth: 310,
    fontSize: 28,
    lineHeight: 34,
    color: colors.text,
    fontWeight: "700",
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
  attendanceCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
  },
  attendanceHeader: {
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
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.homeActionBg,
    alignItems: "center",
    justifyContent: "center",
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
    letterSpacing: 0.6,
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
  footNote: {
    fontSize: 13,
    color: colors.orange,
  },
  sectionHead: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  snapshotList: {
    gap: 12,
  },
  snapshotCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  snapshotIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  snapshotTextWrap: {
    flex: 1,
  },
  snapshotTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  snapshotSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
  snapshotValue: {
    fontSize: 15,
    fontWeight: "800",
  },
});
