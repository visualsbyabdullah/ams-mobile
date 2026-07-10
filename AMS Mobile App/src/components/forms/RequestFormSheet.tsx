import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Calendar } from "lucide-react-native";
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

type CalendarField = "primary" | "secondary";

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

const getTodayDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const toDisplayDateValue = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const toDatabaseDateValue = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

const parseDisplayDateInput = (value: string) => {
  const trimmed = value.trim();

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    return null;
  }

  const [day, month, year] = trimmed.split("/").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    return null;
  }

  return date;
};

const isBeforeToday = (date: Date) => {
  return date.getTime() < getTodayDate().getTime();
};

const getMonthCells = (monthDate: Date) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingEmptyDays = firstDay.getDay();

  const cells: Array<Date | null> = [];

  for (let index = 0; index < leadingEmptyDays; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
};

function DateInput({
  label,
  value,
  placeholder,
  onChangeText,
  onCalendarPress,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  onCalendarPress: () => void;
}) {
  return (
    <View>
      <AppText style={styles.inputLabel}>{label}</AppText>

      <View style={styles.dateInputWrap}>
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType="numbers-and-punctuation"
          onChangeText={onChangeText}
          style={styles.dateInput}
        />

        <Pressable onPress={onCalendarPress} style={styles.calendarButton}>
          <Calendar size={18} color={colors.accent} strokeWidth={2.4} />
        </Pressable>
      </View>
    </View>
  );
}

function CalendarPanel({
  monthDate,
  onPreviousMonth,
  onNextMonth,
  onSelectDate,
}: {
  monthDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date) => void;
}) {
  const cells = getMonthCells(monthDate);
  const today = getTodayDate();

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    return new Date(2026, 0, 4 + index)
      .toLocaleDateString([], { weekday: "short" })
      .slice(0, 2);
  });

  return (
    <View style={styles.calendarPanel}>
      <View style={styles.calendarHeader}>
        <Pressable onPress={onPreviousMonth} style={styles.monthButton}>
          <AppIcon name="chevronLeft" size={18} color="text" />
        </Pressable>

        <AppText style={styles.monthTitle}>
          {monthDate.toLocaleDateString([], {
            month: "long",
            year: "numeric",
          })}
        </AppText>

        <Pressable onPress={onNextMonth} style={styles.monthButton}>
          <AppIcon name="chevronRight" size={18} color="text" />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {weekDays.map((day, index) => (
          <AppText key={`${day}-${index}`} style={styles.weekDay}>
            {day}
          </AppText>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {cells.map((date, index) => {
          const disabled = !date || isBeforeToday(date);
          const isToday =
            date &&
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

          return (
            <Pressable
              key={`${date?.toISOString() ?? "empty"}-${index}`}
              disabled={disabled}
              onPress={() => date && onSelectDate(date)}
              style={[
                styles.dayCell,
                isToday && styles.todayCell,
                disabled && styles.disabledDayCell,
              ]}
            >
              <AppText
                style={[
                  styles.dayText,
                  isToday && styles.todayText,
                  disabled && styles.disabledDayText,
                ]}
              >
                {date ? date.getDate() : ""}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

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
  const [activeCalendarField, setActiveCalendarField] =
    useState<CalendarField | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(getTodayDate());

  const { createRequest, saving } = useEmployeeRequests();

  const activeMeta = type ? meta[type] : null;
  const todayDisplayValue = toDisplayDateValue(getTodayDate());

  useEffect(() => {
    if (!visible || !type) {
      return;
    }

    setSubmitted(false);
    setFormError(null);
    setActiveCalendarField(null);
    setCalendarMonth(getTodayDate());
    setReason("");

    if (type === "leave") {
      setPrimary(todayDisplayValue);
      setSecondary(todayDisplayValue);
      return;
    }

    if (type === "wfh") {
      setPrimary(todayDisplayValue);
      setSecondary("");
      return;
    }

    setPrimary("");
    setSecondary(todayDisplayValue);
  }, [visible, type, todayDisplayValue]);

  const labels = useMemo(() => {
    if (type === "leave") {
      return {
        primary: t("common.fromDate"),
        primaryPlaceholder: todayDisplayValue,
        secondary: t("common.toDate"),
        secondaryPlaceholder: todayDisplayValue,
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
        secondaryPlaceholder: todayDisplayValue,
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
        secondaryPlaceholder: todayDisplayValue,
        reason: t("common.description"),
        reasonPlaceholder: t("requestForm.ticketDesc"),
        keyboardType: "default" as const,
      };
    }

    return {
      primary: t("requestForm.wfhDate"),
      primaryPlaceholder: todayDisplayValue,
      secondary: t("common.title"),
      secondaryPlaceholder: t("requestForm.wfhRequest"),
      reason: t("common.reason"),
      reasonPlaceholder: t("requestForm.wfhDesc"),
      keyboardType: "default" as const,
    };
  }, [type, todayDisplayValue]);

  const resetForm = () => {
    setPrimary("");
    setSecondary("");
    setReason("");
    setSubmitted(false);
    setFormError(null);
    setActiveCalendarField(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCalendarSelect = (field: CalendarField, date: Date) => {
    const displayValue = toDisplayDateValue(date);

    if (field === "primary") {
      setPrimary(displayValue);
    } else {
      setSecondary(displayValue);
    }

    setFormError(null);
    setActiveCalendarField(null);
  };

  const moveMonth = (direction: -1 | 1) => {
    setCalendarMonth((current) => {
      return new Date(
        current.getFullYear(),
        current.getMonth() + direction,
        1
      );
    });
  };

  const validateDate = (value: string) => {
    if (!value.trim()) {
      return t("requestForm.dateRequired");
    }

    const parsed = parseDisplayDateInput(value);

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

        const startDate = parseDisplayDateInput(primary);
        const endDate = parseDisplayDateInput(secondary);

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
          description: reason.trim() || undefined,
          startDate: toDatabaseDateValue(startDate),
          endDate: toDatabaseDateValue(endDate),
        });
      }

      if (type === "wfh") {
        const dateError = validateDate(primary);

        if (dateError) {
          setFormError(dateError);
          return;
        }

        const requestDate = parseDisplayDateInput(primary);

        if (!requestDate) {
          setFormError(t("requestForm.invalidDate"));
          return;
        }

        await createRequest({
          type,
          title: secondary.trim() || t("requests.wfhRequest"),
          description: reason.trim() || undefined,
          startDate: toDatabaseDateValue(requestDate),
          endDate: toDatabaseDateValue(requestDate),
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

        const requestDate = parseDisplayDateInput(secondary);

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
          startDate: toDatabaseDateValue(requestDate),
          endDate: toDatabaseDateValue(requestDate),
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

        const requestDate = parseDisplayDateInput(secondary);

        if (!requestDate) {
          setFormError(t("requestForm.invalidDate"));
          return;
        }

        await createRequest({
          type,
          title: primary.trim(),
          description: reason.trim() || undefined,
          startDate: toDatabaseDateValue(requestDate),
          endDate: toDatabaseDateValue(requestDate),
        });
      }

      setSubmitted(true);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : t("requestForm.submitFailed")
      );
    }
  };

  const renderCalendarPanel = (field: CalendarField) => {
    if (activeCalendarField !== field) {
      return null;
    }

    return (
      <CalendarPanel
        monthDate={calendarMonth}
        onPreviousMonth={() => moveMonth(-1)}
        onNextMonth={() => moveMonth(1)}
        onSelectDate={(date) => handleCalendarSelect(field, date)}
      />
    );
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
                  {type === "leave" ? (
                    <>
                      <DateInput
                        label={labels.primary}
                        placeholder={labels.primaryPlaceholder}
                        value={primary}
                        onChangeText={(value) => {
                          setPrimary(value);
                          setFormError(null);
                        }}
                        onCalendarPress={() =>
                          setActiveCalendarField((current) =>
                            current === "primary" ? null : "primary"
                          )
                        }
                      />
                      {renderCalendarPanel("primary")}

                      <DateInput
                        label={labels.secondary}
                        placeholder={labels.secondaryPlaceholder}
                        value={secondary}
                        onChangeText={(value) => {
                          setSecondary(value);
                          setFormError(null);
                        }}
                        onCalendarPress={() =>
                          setActiveCalendarField((current) =>
                            current === "secondary" ? null : "secondary"
                          )
                        }
                      />
                      {renderCalendarPanel("secondary")}
                    </>
                  ) : null}

                  {type === "wfh" ? (
                    <>
                      <DateInput
                        label={labels.primary}
                        placeholder={labels.primaryPlaceholder}
                        value={primary}
                        onChangeText={(value) => {
                          setPrimary(value);
                          setFormError(null);
                        }}
                        onCalendarPress={() =>
                          setActiveCalendarField((current) =>
                            current === "primary" ? null : "primary"
                          )
                        }
                      />
                      {renderCalendarPanel("primary")}

                      <AppTextInput
                        label={labels.secondary}
                        placeholder={labels.secondaryPlaceholder}
                        value={secondary}
                        onChangeText={(value) => {
                          setSecondary(value);
                          setFormError(null);
                        }}
                      />
                    </>
                  ) : null}

                  {type === "loan" || type === "ticket" ? (
                    <>
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

                      <DateInput
                        label={labels.secondary}
                        placeholder={labels.secondaryPlaceholder}
                        value={secondary}
                        onChangeText={(value) => {
                          setSecondary(value);
                          setFormError(null);
                        }}
                        onCalendarPress={() =>
                          setActiveCalendarField((current) =>
                            current === "secondary" ? null : "secondary"
                          )
                        }
                      />
                      {renderCalendarPanel("secondary")}
                    </>
                  ) : null}

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

                <AppButton title={t("common.submit")} onPress={handleSubmit} />
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
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
    marginBottom: 8,
  },
  dateInputWrap: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 8,
  },
  dateInput: {
    flex: 1,
    height: 52,
    color: colors.text,
    fontSize: 15,
    fontFamily: "Manrope_500Medium",
    outlineStyle: "none" as never,
  },
  calendarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarPanel: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.xl,
    padding: 12,
    gap: 10,
    marginTop: -6,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  monthTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  weekRow: {
    flexDirection: "row",
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  todayCell: {
    borderRadius: 19,
    backgroundColor: colors.accent,
  },
  disabledDayCell: {
    opacity: 0.35,
  },
  dayText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  todayText: {
    color: colors.inverseText,
  },
  disabledDayText: {
    color: colors.textMuted,
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
