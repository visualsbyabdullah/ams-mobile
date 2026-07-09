import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { AppIcon, IconName } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";
import { t } from "../../i18n";
import { colors } from "../../theme";

type NotificationsSheetProps = {
  visible: boolean;
  onClose: () => void;
};

type NotificationItem = {
  key: string;
  titleKey: string;
  descKey: string;
  timeKey: string;
  icon: IconName;
  tone: "accent" | "orange" | "info";
};

const notifications: NotificationItem[] = [
  {
    key: "leave",
    titleKey: "notifications.leaveApproved",
    descKey: "notifications.leaveApprovedDesc",
    timeKey: "notifications.timeNow",
    icon: "calendar",
    tone: "accent",
  },
  {
    key: "salary",
    titleKey: "notifications.salarySlipReady",
    descKey: "notifications.salarySlipReadyDesc",
    timeKey: "notifications.timeToday",
    icon: "salary",
    tone: "orange",
  },
  {
    key: "ticket",
    titleKey: "notifications.ticketUpdated",
    descKey: "notifications.ticketUpdatedDesc",
    timeKey: "notifications.timeYesterday",
    icon: "ticket",
    tone: "info",
  },
];

const toneMap = {
  accent: {
    bg: colors.accentSoft,
    color: "accent" as const,
  },
  orange: {
    bg: colors.orangeSoft,
    color: "orange" as const,
  },
  info: {
    bg: colors.infoSoft,
    color: "info" as const,
  },
};

export function NotificationsSheet({
  visible,
  onClose,
}: NotificationsSheetProps) {
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
                  <AppIcon name="bell" size={20} color="accent" />
                </View>

                <View style={styles.headerText}>
                  <AppText style={styles.title}>{t("notifications.title")}</AppText>
                  <AppText style={styles.subtitle}>{t("notifications.subtitle")}</AppText>
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
                  <AppIcon name="bell" size={17} color="inverseText" />
                </View>

                <View style={styles.statusTextWrap}>
                  <AppText style={styles.statusTitle}>{t("notifications.title")}</AppText>
                  <AppText style={styles.statusSubtitle}>{t("notifications.subtitle")}</AppText>
                </View>
              </View>

              <View style={styles.list}>
                {notifications.map((item) => {
                  const tone = toneMap[item.tone];

                  return (
                    <View key={item.key} style={styles.notificationCard}>
                      <View style={[styles.notificationIcon, { backgroundColor: tone.bg }]}>
                        <AppIcon name={item.icon} size={18} color={tone.color} />
                      </View>

                      <View style={styles.notificationText}>
                        <AppText style={styles.notificationTitle}>{t(item.titleKey)}</AppText>
                        <AppText style={styles.notificationDesc}>{t(item.descKey)}</AppText>
                      </View>

                      <AppText style={styles.notificationTime}>{t(item.timeKey)}</AppText>
                    </View>
                  );
                })}
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
    height: "72%",
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
    paddingBottom: 20,
  },
  statusCard: {
    backgroundColor: colors.homeStatusBg,
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
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
  list: {
    gap: 12,
  },
  notificationCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  notificationIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 2,
  },
  notificationDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  notificationTime: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "800",
    color: colors.accent,
  },
});
