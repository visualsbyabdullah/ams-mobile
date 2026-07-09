import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { AppIcon, IconName } from "../../components/ui/AppIcon";
import { AppText } from "../../components/ui/AppText";
import { ResolvedPolicy } from "../../features/policies/types";
import {
  getEnabledRequestTypes,
  isRequestTypeEnabled,
} from "../../features/requests/requestConfig";
import { RequestType } from "../../features/requests/types";
import { t } from "../../i18n";
import { colors } from "../../theme";

type RequestsScreenProps = {
  policy: ResolvedPolicy;
  onCreateRequest: (type: RequestType) => void;
};

type RequestHistoryItem = {
  key: string;
  type: RequestType;
  titleKey: string;
  subtitle: string;
  icon: IconName;
  statusKey: string;
  statusColor: keyof typeof colors;
};

const historyItems: RequestHistoryItem[] = [
  {
    key: "leave-1",
    type: "leave",
    titleKey: "requests.annualLeave",
    subtitle: "12 Jul - 14 Jul",
    icon: "calendar",
    statusKey: "requests.pending",
    statusColor: "orange",
  },
  {
    key: "loan-1",
    type: "loan",
    titleKey: "requests.loanRequest",
    subtitle: "PKR 25,000",
    icon: "loan",
    statusKey: "requests.approved",
    statusColor: "accent",
  },
  {
    key: "ticket-1",
    type: "ticket",
    titleKey: "requests.laptopIssue",
    subtitle: "IT support ticket",
    icon: "ticket",
    statusKey: "requests.open",
    statusColor: "info",
  },
  {
    key: "wfh-1",
    type: "wfh",
    titleKey: "requests.wfhRequest",
    subtitle: "15 Jul 2026",
    icon: "laptop",
    statusKey: "requests.approved",
    statusColor: "accent",
  },
];

export function RequestsScreen({
  policy,
  onCreateRequest,
}: RequestsScreenProps) {
  const enabledRequestTypes = getEnabledRequestTypes(policy);

  const visibleHistory = historyItems.filter((item) =>
    isRequestTypeEnabled(policy, item.type)
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topRow}>
        <View>
          <AppText style={styles.screenTitle}>{t("requests.title")}</AppText>
          <AppText style={styles.screenSubtitle}>{t("requests.subtitle")}</AppText>
        </View>

        <View style={styles.headerIcon}>
          <AppIcon name="request" size={20} color="accent" />
        </View>
      </View>

      <View style={styles.statusPill}>
        <View style={styles.statusIconWrap}>
          <AppIcon name="plus" size={17} color="inverseText" />
        </View>

        <View style={styles.statusTextWrap}>
          <AppText style={styles.statusTitle}>{t("requests.createRequest")}</AppText>
          <AppText style={styles.statusSubtitle}>
            {enabledRequestTypes.length > 0
              ? t("requests.subtitle")
              : t("requests.noRequestModules")}
          </AppText>
        </View>
      </View>

      <View style={styles.sectionHead}>
        <AppText style={styles.sectionTitle}>{t("requests.createRequest")}</AppText>
      </View>

      {enabledRequestTypes.length > 0 ? (
        <View style={styles.requestList}>
          {enabledRequestTypes.map((item) => (
            <Pressable
              key={item.type}
              onPress={() => onCreateRequest(item.type)}
              style={({ pressed }) => [
                styles.requestCard,
                pressed && styles.pressedCard,
              ]}
            >
              <View
                style={[
                  styles.requestIconWrap,
                  { backgroundColor: colors[item.softColor] },
                ]}
              >
                <AppIcon name={item.icon} size={19} color={item.color} />
              </View>

              <View style={styles.requestTextWrap}>
                <AppText style={styles.requestTitle}>{t(item.titleKey)}</AppText>
                <AppText style={styles.requestSubtitle}>
                  {t(item.descriptionKey)}
                </AppText>
              </View>

              <AppIcon name="chevronRight" size={18} color="textMuted" />
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <AppIcon name="request" size={20} color="textMuted" />
          </View>
          <AppText style={styles.emptyText}>{t("requests.noRequestModules")}</AppText>
        </View>
      )}

      <View style={styles.sectionHeadWithAction}>
        <AppText style={styles.sectionTitle}>{t("requests.myRequests")}</AppText>
        <AppText style={styles.seeAllText}>{t("common.seeAll")}</AppText>
      </View>

      {visibleHistory.length > 0 ? (
        <View style={styles.historyList}>
          {visibleHistory.map((item) => (
            <View key={item.key} style={styles.historyCard}>
              <View style={styles.historyLeft}>
                <View style={styles.historyIconWrap}>
                  <AppIcon name={item.icon} size={18} color="accent" />
                </View>

                <View style={styles.historyTextWrap}>
                  <AppText style={styles.historyTitle}>{t(item.titleKey)}</AppText>
                  <AppText style={styles.historySubtitle}>{item.subtitle}</AppText>
                </View>
              </View>

              <View style={styles.statusBadge}>
                <AppText
                  style={[
                    styles.statusBadgeText,
                    { color: colors[item.statusColor] },
                  ]}
                >
                  {t(item.statusKey)}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <AppIcon name="file" size={20} color="textMuted" />
          </View>
          <AppText style={styles.emptyText}>{t("requests.noRequests")}</AppText>
        </View>
      )}
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
    marginBottom: 22,
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
  seeAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.accent,
  },
  requestList: {
    gap: 12,
  },
  requestCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  pressedCard: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  requestIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  requestTextWrap: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  requestSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  historyLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  historyIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  historyTextWrap: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  historySubtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
  statusBadge: {
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  emptyCard: {
    minHeight: 130,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: "center",
  },
});
