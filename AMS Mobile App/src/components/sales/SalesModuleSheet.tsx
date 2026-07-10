import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { AppIcon } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";
import { SalesEntryFormSheet } from "./SalesEntryFormSheet";
import { useEmployeeSession } from "../../features/session";
import {
  canCreateSaleEntry,
  canViewBranchSales,
  canViewOwnSales,
} from "../../features/policies/guards";
import { getOwnSalesEntries, SalesEntry } from "../../features/sales";
import { t } from "../../i18n";
import { colors } from "../../theme";

type SalesModuleSheetProps = {
  visible: boolean;
  onClose: () => void;
};

const formatAmount = (amount: number | null) => {
  if (amount === null) {
    return "-";
  }

  return `PKR ${amount.toLocaleString()}`;
};

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

export const SalesModuleSheet = ({
  visible,
  onClose,
}: SalesModuleSheetProps) => {
  const [entryFormVisible, setEntryFormVisible] = useState(false);
  const [entries, setEntries] = useState<SalesEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [entriesError, setEntriesError] = useState<string | null>(null);

  const { employeeBundle, resolvedPolicy } = useEmployeeSession();

  const canCreate = canCreateSaleEntry(resolvedPolicy);
  const canViewOwn = canViewOwnSales(resolvedPolicy);
  const canViewBranch = canViewBranchSales(resolvedPolicy);

  const loadEntries = async () => {
    if (!employeeBundle || !canViewOwn) {
      setEntries([]);
      return;
    }

    setLoadingEntries(true);
    setEntriesError(null);

    try {
      const nextEntries = await getOwnSalesEntries(employeeBundle);
      setEntries(nextEntries);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load sales entries.";

      setEntriesError(message);
      setEntries([]);
    } finally {
      setLoadingEntries(false);
    }
  };

  useEffect(() => {
    if (!visible) {
      return;
    }

    void loadEntries();
  }, [visible, employeeBundle?.employee.id, canViewOwn]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <AppIcon name="request" size={20} color="accent" />
            </View>

            <View style={styles.headerText}>
              <AppText style={styles.title}>{t("sales.sheetTitle")}</AppText>
              <AppText style={styles.subtitle}>
                {t("sales.sheetSubtitle")}
              </AppText>
            </View>

            <Pressable onPress={onClose} style={styles.closeButton}>
              <AppIcon name="x" size={18} color="textMuted" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.permissionCard}>
              <AppText style={styles.sectionTitle}>
                {t("sales.permissionsTitle")}
              </AppText>

              <View style={styles.permissionRow}>
                <AppText style={styles.permissionLabel}>
                  {t("sales.createSaleEntry")}
                </AppText>
                <AppText style={styles.permissionValue}>
                  {canCreate ? t("common.enabled") : t("common.disabled")}
                </AppText>
              </View>

              <View style={styles.permissionRow}>
                <AppText style={styles.permissionLabel}>
                  {t("sales.viewOwnSales")}
                </AppText>
                <AppText style={styles.permissionValue}>
                  {canViewOwn ? t("common.enabled") : t("common.disabled")}
                </AppText>
              </View>

              <View style={styles.permissionRow}>
                <AppText style={styles.permissionLabel}>
                  {t("sales.viewBranchSales")}
                </AppText>
                <AppText style={styles.permissionValue}>
                  {canViewBranch ? t("common.enabled") : t("common.disabled")}
                </AppText>
              </View>
            </View>

            <Pressable
              disabled={!canCreate}
              onPress={() => setEntryFormVisible(true)}
              style={[
                styles.primaryButton,
                !canCreate && styles.primaryButtonDisabled,
              ]}
            >
              <AppText style={styles.primaryButtonText}>
                {t("sales.addSaleEntry")}
              </AppText>
            </Pressable>

            <View style={styles.entriesHeader}>
              <AppText style={styles.sectionTitle}>
                {t("sales.recentEntries")}
              </AppText>

              <Pressable onPress={loadEntries} disabled={loadingEntries}>
                <AppText style={styles.refreshText}>
                  {loadingEntries ? t("sales.loading") : t("sales.refresh")}
                </AppText>
              </Pressable>
            </View>

            {entriesError && (
              <AppText style={styles.errorText}>{entriesError}</AppText>
            )}

            {!entriesError && entries.length === 0 && (
              <View style={styles.emptyCard}>
                <AppText style={styles.emptyText}>
                  {loadingEntries
                    ? t("sales.loadingEntries")
                    : t("sales.noEntries")}
                </AppText>
              </View>
            )}

            {entries.map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryTopRow}>
                  <AppText style={styles.entryTitle}>
                    {entry.product_or_service || t("sales.saleEntry")}
                  </AppText>

                  <AppText style={styles.entryAmount}>
                    {formatAmount(entry.amount)}
                  </AppText>
                </View>

                <AppText style={styles.entryMeta}>
                  {t("sales.salesCount")}: {entry.sales_count}
                </AppText>

                {entry.customer_name && (
                  <AppText style={styles.entryMeta}>
                    {t("sales.customer")}: {entry.customer_name}
                  </AppText>
                )}

                <AppText style={styles.entryMeta}>
                  {formatDateTime(entry.sale_time)}
                </AppText>

                {entry.precise_location_verified && (
                  <AppText style={styles.locationVerified}>
                    {t("sales.preciseLocationVerified")}
                  </AppText>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        <SalesEntryFormSheet
          visible={entryFormVisible}
          onClose={() => setEntryFormVisible(false)}
          onSaved={() => {
            setEntryFormVisible(false);
            void loadEntries();
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.backdrop,
    justifyContent: "flex-end",
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    width: "100%",
    maxWidth: 430,
    maxHeight: "92%",
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 34,
  },
  handle: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
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
    lineHeight: 24,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionCard: {
    borderRadius: 22,
    backgroundColor: colors.surfaceSoft,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
    color: colors.text,
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  permissionLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  permissionValue: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    color: colors.accent,
  },
  primaryButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  primaryButtonDisabled: {
    opacity: 0.45,
  },
  primaryButtonText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
    color: colors.inverseText,
  },
  entriesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  refreshText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    color: colors.accent,
  },
  emptyCard: {
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
    padding: 16,
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    textAlign: "center",
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.orange,
    textAlign: "center",
    marginBottom: 10,
  },
  entryCard: {
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
    padding: 14,
    marginBottom: 10,
  },
  entryTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 6,
  },
  entryTitle: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
    color: colors.text,
  },
  entryAmount: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    color: colors.accent,
  },
  entryMeta: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
  locationVerified: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "800",
    color: colors.accent,
    marginTop: 6,
  },
});
