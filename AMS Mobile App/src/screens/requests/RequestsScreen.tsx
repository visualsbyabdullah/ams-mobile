import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { AppIcon, IconName } from "../../components/ui/AppIcon";
import { AppText } from "../../components/ui/AppText";
import { ResolvedPolicy } from "../../features/policies/types";
import {
  getEnabledRequestTypes,
  isRequestTypeEnabled,
} from "../../features/requests/requestConfig";
import { RequestType } from "../../features/requests/types";
import { useEmployeeRequests } from "../../features/requests";
import { t } from "../../i18n";
import { colors } from "../../theme";

type RequestsScreenProps = {
  policy: ResolvedPolicy;
  onCreateRequest: (type: RequestType) => void;
};

const statusColorMap: Record<string, keyof typeof colors> = {
  pending: "orange",
  approved: "accent",
  rejected: "danger",
  cancelled: "textMuted",
  open: "info",
};

const statusLabelMap: Record<string, string> = {
  pending: "requests.pending",
  approved: "requests.approved",
  rejected: "requests.rejected",
  cancelled: "requests.cancelled",
  open: "requests.open",
};

const fallbackIconMap: Record<RequestType, IconName> = {
  leave: "calendar",
  loan: "loan",
  ticket: "ticket",
  wfh: "laptop",
};

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return "";
  }

  const parts = value.split("-");

  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function RequestsScreen({
  policy,
  onCreateRequest,
}: RequestsScreenProps) {
  const [typePickerVisible, setTypePickerVisible] = useState(false);
  const enabledRequestTypes = getEnabledRequestTypes(policy);
  const { requests, loading } = useEmployeeRequests();

  const visibleRequests = useMemo(() => {
    return requests.filter((item) =>
      isRequestTypeEnabled(policy, item.type)
    );
  }, [policy, requests]);

  const handleSelectType = (type: RequestType) => {
    setTypePickerVisible(false);
    onCreateRequest(type);
  };

  return (
    <>
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

          <Pressable
            onPress={() => setTypePickerVisible(true)}
            disabled={enabledRequestTypes.length === 0}
            style={({ pressed }) => [
              styles.headerIcon,
              pressed && styles.pressedCard,
              enabledRequestTypes.length === 0 && styles.disabledButton,
            ]}
          >
            <AppIcon name="plus" size={20} color="accent" />
          </Pressable>
        </View>

        <Pressable
          onPress={() => setTypePickerVisible(true)}
          disabled={enabledRequestTypes.length === 0}
          style={({ pressed }) => [
            styles.statusPill,
            pressed && styles.pressedCard,
            enabledRequestTypes.length === 0 && styles.disabledCard,
          ]}
        >
          <View style={styles.statusIconWrap}>
            <AppIcon name="plus" size={17} color="inverseText" />
          </View>

          <View style={styles.statusTextWrap}>
            <AppText style={styles.statusTitle}>{t("requests.createRequest")}</AppText>
            <AppText style={styles.statusSubtitle}>
              {enabledRequestTypes.length > 0
                ? t("requests.createFromPlus")
                : t("requests.noRequestModules")}
            </AppText>
          </View>

          <AppIcon name="chevronRight" size={18} color="inverseText" />
        </Pressable>

        <View style={styles.sectionHeadWithAction}>
          <AppText style={styles.sectionTitle}>{t("requests.myRequests")}</AppText>
        </View>

        {visibleRequests.length > 0 ? (
          <View style={styles.historyList}>
            {visibleRequests.map((item) => {
              const config = enabledRequestTypes.find(
                (requestType) => requestType.type === item.type
              );

              const startDate = formatDate(item.start_date);
              const endDate = formatDate(item.end_date);
              const subtitle =
                startDate && endDate && startDate !== endDate
                  ? `${startDate} - ${endDate}`
                  : startDate || item.description || "-";

              const statusColor = statusColorMap[item.status] ?? "textMuted";
              const statusLabel = statusLabelMap[item.status] ?? "requests.pending";

              return (
                <View key={item.id} style={styles.historyCard}>
                  <View style={styles.historyLeft}>
                    <View style={styles.historyIconWrap}>
                      <AppIcon
                        name={config?.icon ?? fallbackIconMap[item.type]}
                        size={18}
                        color="accent"
                      />
                    </View>

                    <View style={styles.historyTextWrap}>
                      <AppText style={styles.historyTitle}>
                        {item.title || (config ? t(config.titleKey) : t("requests.request"))}
                      </AppText>
                      <AppText style={styles.historySubtitle}>{subtitle}</AppText>
                    </View>
                  </View>

                  <View style={styles.statusBadge}>
                    <AppText
                      style={[
                        styles.statusBadgeText,
                        { color: colors[statusColor] },
                      ]}
                    >
                      {t(statusLabel)}
                    </AppText>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <AppIcon name="file" size={20} color="textMuted" />
            </View>
            <AppText style={styles.emptyText}>
              {loading ? t("common.loading") : t("requests.noRequests")}
            </AppText>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={typePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTypePickerVisible(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setTypePickerVisible(false)}
          />

          <View style={styles.sheetWrap}>
            <View style={styles.sheet}>
              <View style={styles.handle} />

              <View style={styles.pickerHeader}>
                <View>
                  <AppText style={styles.pickerTitle}>
                    {t("requests.createRequest")}
                  </AppText>
                  <AppText style={styles.pickerSubtitle}>
                    {t("requests.chooseRequestType")}
                  </AppText>
                </View>

                <Pressable
                  onPress={() => setTypePickerVisible(false)}
                  style={styles.closeButton}
                >
                  <AppIcon name="x" size={20} color="textMuted" />
                </Pressable>
              </View>

              {enabledRequestTypes.length > 0 ? (
                <View style={styles.requestList}>
                  {enabledRequestTypes.map((item) => (
                    <Pressable
                      key={item.type}
                      onPress={() => handleSelectType(item.type)}
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
                        <AppText style={styles.requestTitle}>
                          {t(item.titleKey)}
                        </AppText>
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
                  <AppText style={styles.emptyText}>
                    {t("requests.noRequestModules")}
                  </AppText>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    fontWeight: "800",
    marginBottom: 3,
  },
  statusSubtitle: {
    color: colors.homeStatusMutedText,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeadWithAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  historyLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
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
    color: colors.text,
    fontWeight: "800",
    marginBottom: 3,
  },
  historySubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  statusBadge: {
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  emptyIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
  requestList: {
    gap: 12,
  },
  requestCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 15,
    color: colors.text,
    fontWeight: "800",
    marginBottom: 2,
  },
  requestSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
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
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sheet: {
    width: "100%",
    maxWidth: 430,
    borderRadius: 28,
    backgroundColor: colors.surface,
    padding: 20,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: 18,
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 12,
  },
  pickerTitle: {
    fontSize: 20,
    color: colors.text,
    fontWeight: "800",
    marginBottom: 4,
  },
  pickerSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  pressedCard: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledCard: {
    opacity: 0.75,
  },
});
