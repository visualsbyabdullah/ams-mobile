import { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { RequestType } from "../../features/requests/types";
import { t } from "../../i18n";
import { colors, radius, spacing } from "../../theme";
import { AppButton } from "../ui/AppButton";
import { AppIcon, IconName } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";
import { AppTextInput } from "./AppTextInput";

type RequestFormSheetProps = {
  type: RequestType | null;
  visible: boolean;
  onClose: () => void;
};

type RequestMeta = {
  title: string;
  description: string;
  icon: IconName;
  color: keyof typeof colors;
  softColor: keyof typeof colors;
};

const meta: Record<RequestType, RequestMeta> = {
  leave: {
    title: "requestForm.leaveTitle",
    description: "requestForm.leaveDesc",
    icon: "calendar",
    color: "accent",
    softColor: "accentSoft",
  },
  loan: {
    title: "requestForm.loanTitle",
    description: "requestForm.loanDesc",
    icon: "loan",
    color: "orange",
    softColor: "orangeSoft",
  },
  ticket: {
    title: "requestForm.ticketTitle",
    description: "requestForm.ticketDesc",
    icon: "ticket",
    color: "info",
    softColor: "infoSoft",
  },
  wfh: {
    title: "requestForm.wfhTitle",
    description: "requestForm.wfhDesc",
    icon: "laptop",
    color: "success",
    softColor: "successSoft",
  },
};

export function RequestFormSheet({
  type,
  visible,
  onClose,
}: RequestFormSheetProps) {
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const activeMeta = type ? meta[type] : null;

  const labels = useMemo(() => {
    if (type === "leave") {
      return {
        primary: t("common.fromDate"),
        primaryPlaceholder: "2026-07-09",
        secondary: t("common.toDate"),
        secondaryPlaceholder: "2026-07-10",
        reason: t("common.reason"),
        reasonPlaceholder: t("requestForm.leaveType"),
        keyboardType: "default" as const,
      };
    }

    if (type === "loan") {
      return {
        primary: t("requestForm.loanAmount"),
        primaryPlaceholder: "25000",
        secondary: t("common.date"),
        secondaryPlaceholder: "2026-07-09",
        reason: t("common.reason"),
        reasonPlaceholder: t("requestForm.loanDesc"),
        keyboardType: "numeric" as const,
      };
    }

    if (type === "ticket") {
      return {
        primary: t("common.title"),
        primaryPlaceholder: t("requestForm.ticketCategory"),
        secondary: t("common.date"),
        secondaryPlaceholder: "2026-07-09",
        reason: t("common.description"),
        reasonPlaceholder: t("requestForm.ticketDesc"),
        keyboardType: "default" as const,
      };
    }

    return {
      primary: t("requestForm.wfhDate"),
      primaryPlaceholder: "2026-07-09",
      secondary: t("common.title"),
      secondaryPlaceholder: t("requestForm.wfhRequest"),
      reason: t("common.reason"),
      reasonPlaceholder: t("requestForm.wfhDesc"),
      keyboardType: "default" as const,
    };
  }, [type]);

  const resetForm = () => {
    setPrimary("");
    setSecondary("");
    setReason("");
    setSubmitted(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!activeMeta) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <View style={styles.sheetWrap}>
          <View style={styles.sheet}>
            <View style={styles.handle} />

            {submitted ? (
              <View style={styles.successState}>
                <View style={styles.successIcon}>
                  <AppIcon name="check" size={36} color="accent" />
                </View>

                <AppText variant="subtitle" style={styles.successTitle}>
                  {t("requestForm.submittedTitle")}
                </AppText>

                <AppText color="textMuted" style={styles.successText}>
                  {t("requestForm.submittedDesc")}
                </AppText>

                <AppButton title={t("common.done")} onPress={handleClose} />
              </View>
            ) : (
              <>
                <View style={styles.header}>
                  <View
                    style={[
                      styles.headerIcon,
                      { backgroundColor: colors[activeMeta.softColor] },
                    ]}
                  >
                    <AppIcon
                      name={activeMeta.icon}
                      color={activeMeta.color}
                      size={24}
                    />
                  </View>

                  <View style={styles.headerText}>
                    <AppText variant="subtitle">{t(activeMeta.title)}</AppText>
                    <AppText color="textMuted">{t(activeMeta.description)}</AppText>
                  </View>

                  <Pressable onPress={handleClose} style={styles.closeButton}>
                    <AppIcon name="x" size={20} color="textMuted" />
                  </Pressable>
                </View>

                <View style={styles.form}>
                  <AppTextInput
                    label={labels.primary}
                    placeholder={labels.primaryPlaceholder}
                    value={primary}
                    keyboardType={labels.keyboardType}
                    onChangeText={setPrimary}
                  />

                  <AppTextInput
                    label={labels.secondary}
                    placeholder={labels.secondaryPlaceholder}
                    value={secondary}
                    onChangeText={setSecondary}
                  />

                  <AppTextInput
                    label={labels.reason}
                    placeholder={labels.reasonPlaceholder}
                    value={reason}
                    multiline
                    onChangeText={setReason}
                  />
                </View>

                <AppButton
                  title={t("common.submit")}
                  onPress={() => setSubmitted(true)}
                />
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
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  sheet: {
    width: "100%",
    maxWidth: 430,
    borderRadius: radius["2xl"],
    backgroundColor: colors.surface,
    padding: spacing.xl,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    gap: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  successState: {
    alignItems: "center",
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: radius.full,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    textAlign: "center",
    marginTop: spacing.sm,
  },
  successText: {
    textAlign: "center",
    marginBottom: spacing.lg,
  },
});
