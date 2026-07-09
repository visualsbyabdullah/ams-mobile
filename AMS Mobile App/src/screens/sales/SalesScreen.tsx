import { View, StyleSheet } from "react-native";

import { AppText } from "../../components/ui/AppText";
import { colors } from "../../theme";
import { t } from "../../i18n";
import { useEmployeeSession } from "../../features/session";
import {
  canCreateSaleEntry,
  canUseSales,
  canViewOwnSales,
} from "../../features/policies/guards";

export const SalesScreen = () => {
  const { resolvedPolicy } = useEmployeeSession();

  const salesVisible = canUseSales(resolvedPolicy);
  const canCreate = canCreateSaleEntry(resolvedPolicy);
  const canViewOwn = canViewOwnSales(resolvedPolicy);

  if (!salesVisible) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerCard}>
        <AppText variant="eyebrow" style={styles.eyebrow}>
          {t("sales.eyebrow")}
        </AppText>

        <AppText variant="title" style={styles.title}>
          {t("sales.title")}
        </AppText>

        <AppText variant="body" style={styles.description}>
          {t("sales.description")}
        </AppText>
      </View>

      <View style={styles.card}>
        <AppText variant="subtitle" style={styles.cardTitle}>
          {t("sales.permissionsTitle")}
        </AppText>

        <View style={styles.permissionRow}>
          <AppText variant="body" style={styles.permissionLabel}>
            {t("sales.createSaleEntry")}
          </AppText>
          <AppText variant="body" style={styles.permissionValue}>
            {canCreate ? t("common.enabled") : t("common.disabled")}
          </AppText>
        </View>

        <View style={styles.permissionRow}>
          <AppText variant="body" style={styles.permissionLabel}>
            {t("sales.viewOwnSales")}
          </AppText>
          <AppText variant="body" style={styles.permissionValue}>
            {canViewOwn ? t("common.enabled") : t("common.disabled")}
          </AppText>
        </View>
      </View>

      <View style={styles.infoCard}>
        <AppText variant="body" style={styles.infoText}>
          {t("sales.placeholderNote")}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 14,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eyebrow: {
    color: colors.textMuted,
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    color: colors.textMuted,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  cardTitle: {
    color: colors.text,
    marginBottom: 4,
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  permissionLabel: {
    flex: 1,
    color: colors.textMuted,
  },
  permissionValue: {
    color: colors.text,
  },
  infoCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 22,
    padding: 16,
  },
  infoText: {
    color: colors.textMuted,
    lineHeight: 22,
  },
});
