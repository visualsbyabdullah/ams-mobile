import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { AppIcon } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";
import { SalesEntryFormSheet } from "./SalesEntryFormSheet";
import { useEmployeeSession } from "../../features/session";
import {
  canCreateSaleEntry,
  canViewBranchSales,
  canViewOwnSales,
} from "../../features/policies/guards";
import { t } from "../../i18n";
import { colors } from "../../theme";

type SalesModuleSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export const SalesModuleSheet = ({
  visible,
  onClose,
}: SalesModuleSheetProps) => {
  const [entryFormVisible, setEntryFormVisible] = useState(false);
  const { resolvedPolicy } = useEmployeeSession();

  const canCreate = canCreateSaleEntry(resolvedPolicy);
  const canViewOwn = canViewOwnSales(resolvedPolicy);
  const canViewBranch = canViewBranchSales(resolvedPolicy);

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

          <AppText style={styles.note}>{t("sales.nextStepNote")}</AppText>
        </View>

        <SalesEntryFormSheet
          visible={entryFormVisible}
          onClose={() => setEntryFormVisible(false)}
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
  note: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 12,
  },
});
