import { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { RequestType } from "../../features/requests/types";
import { useEmployeeRequests } from "../../features/requests";
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

const getTodayValue = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseDateInput = (value: string) => {
  const trimmed = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return null;
  }

  const [year, month, day] = trimmed.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

const toDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const isBeforeToday = (date: Date) => {
  const today = parseDateInput(getTodayValue());

  if (!today) {
    return false;
  }

  return date.getTime() < today.getTime();
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
  const [formError, setFormError] = useState<string | null>(null);

  const { createRequest, saving } = useEmployeeRequests();

  const activeMeta = type ? meta[type] : null;
  const todayPlaceholder = getTodayValue();

  const labels = useMemo(() => {
    if (type === "leave") {
      return {
        primary: t("common.fromDate"),
        primaryPlaceholder: todayPlaceholder,
        secondary: t("common.toDate"),
        secondaryPlaceholder: todayPlaceholder,
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
        secondaryPlaceholder: todayPlaceholder,
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
        secondaryPlaceholder: todayPlaceholder,
        reason: t("common.description"),
        reasonPlaceholder: t("requestForm.ticketDesc"),
        keyboardType: "default" as const,
      };
    }

    return {
      primary: t("requestForm.wfhDate"),
      primaryPlaceholder: todayPlaceholder,
      secondary: t("common.title"),
      secondaryPlaceholder: t("requestForm.wfhRequest"),
      reason: t("common.reason"),
      reasonPlaceholder: t("requestForm.wfhDesc"),
      keyboardType: "default" as const,
    };
  }, [type, todayPlaceholder]);

  const resetForm = () => {
    setPrimary("");
    setSecondary("");
    setReason("");
    setSubmitted(false);
    setFormError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateDate = (value: string) => {
    if (!value.trim()) {
      return t("requestForm.dateRequired");
    }

    const parsed = parseDateInput(value);

    if (!parsed) {
      return t("requestForm.invalidDate");
    }

    if (isBeforeToday(parsed)) {
      return t("requestForm.pastDateNotAllowed");
    }

    return null;
  };

  const handleSubmit = async () => {
    if (!type || saving) {
      return;
    }

    setFormError(null);

    try {
      if (type === "leave") {
        const startDateError = validateDate(primary);
        const endDateError = validateDate(secondary);

        if (startDateError || endDateError) {
          setFormError(startDateError ?? endDateError);
          return;
        }

        const startDate = parseDateInput(primary);
        const endDate = parseDateInput(secondary);

        if (!startDate || !endDate) {
          setFormError(t("requestForm.invalidDate"));
          return;
        }

        if (endDate.getTime() < startDate.getTime()) {
          setFormError(t("requestForm.endDateBeforeStart"));
          return;
        }

        await createRequest({
          type,
          title: t("requests.annualLeave"),
          description: reason.trim() || null,
          startDate: toDateValue(startDate),
          endDate: toDateValue(endDate),
        });
      }

      if (type === "wfh") {
        const dateError = validateDate(primary);

        if (dateError) {
          setFormError(dateError);
          return;
        }

        const requestDate = parseDateInput(primary);

        if (!requestDate) {
          setFormError(t("requestForm.invalidDate"));
          return;
        }

        await createRequest({
          type,
          title: secondary.trim() || t("requests.wfhRequest"),
          description: reason.trim() || null,
          startDate: toDateValue(requestDate),
          endDate: toDateValue(requestDate),
        });
      }

      if (type === "loan") {
        if (!primary.trim()) {
          setFormError(t("requestForm.amountRequired"));
          return;
        }

        const dateError = validateDate(secondary);

        if (dateError) {
          setFormError(dateError);
          return;
        }

        const requestDate = parseDateInput(secondary);

        if (!requestDate) {
          setFormError(t("requestForm.invalidDate"));
          return;
        }

        await createRequest({
          type,
          title: t("requests.loanRequest"),
          description: reason.trim()
            ? `${t("requestForm.loanAmount")}: ${primary.trim()} · ${reason.trim()}`
            : `${t("requestForm.loanAmount")}: ${primary.trim()}`,
          startDate: toDateValue(requestDate),
          endDate: toDateValue(requestDate),
        });
      }

      if (type === "ticket") {
        if (!primary.trim()) {
          setFormError(t("requestForm.titleRequired"));
          return;
        }

        const dateError = validateDate(secondary);

        if (dateError) {
          setFormError(dateError);
          return;
        }

        const requestDate = parseDateInput(secondary);

        if (!requestDate) {
          setFormError(t("requestForm.invalidDate"));
          return;
        }

        await createRequest({
          type,
          title: primary.trim(),
          description: reason.trim() || null,
          startDate: toDateValue(requestDate),
          endDate: toDateValue(requestDate),
        });
      }

      setSubmitted(true);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : t("requestForm.submitFailed")
      );
    }
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
                    onChangeText={(value) => {
                      setPrimary(value);
                      setFormError(null);
                    }}
                  />

                  <AppTextInput
                    label={labels.secondary}
                    placeholder={labels.secondaryPlaceholder}
                    value={secondary}
                    onChangeText={(value) => {
                      setSecondary(value);
                      setFormError(null);
                    }}
                  />

                  <AppTextInput
                    label={labels.reason}
                    placeholder={labels.reasonPlaceholder}
                    value={reason}
                    multiline
                    onChangeText={(value) => {
                      setReason(value);
                      setFormError(null);
                    }}
                  />

                  {formError && (
                    <View style={styles.errorBox}>
                      <AppIcon name="shield" size={16} color="danger" />
                      <AppText style={styles.errorText}>{formError}</AppText>
                    </View>
                  )}
                </View>

                <AppButton
                  title={saving ? t("common.saving") : t("common.submit")}
                  onPress={handleSubmit}
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
  errorBox: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    color: colors.danger,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
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
