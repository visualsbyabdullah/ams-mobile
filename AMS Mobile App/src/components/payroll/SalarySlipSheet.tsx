import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { AppIcon } from "../ui/AppIcon";
import { AppText } from "../ui/AppText";
import {
  calculatePayrollPreview,
  formatMoney,
  getSalaryBasisLabelKey,
} from "../../features/payroll/calculatePayroll";
import { ResolvedPolicy } from "../../features/policies/types";
import { t } from "../../i18n";
import { colors } from "../../theme";

type SalarySlipSheetProps = {
  visible: boolean;
  policy: ResolvedPolicy;
  onClose: () => void;
};

function Row({
  label,
  value,
  strong,
  danger,
}: {
  label: string;
  value: string;
  strong?: boolean;
  danger?: boolean;
}) {
  return (
    <View style={styles.row}>
      <AppText style={styles.rowLabel}>{label}</AppText>
      <AppText
        style={[
          styles.rowValue,
          strong && styles.rowValueStrong,
          danger && styles.rowValueDanger,
        ]}
      >
        {value}
      </AppText>
    </View>
  );
}

export function SalarySlipSheet({
  visible,
  policy,
  onClose,
}: SalarySlipSheetProps) {
  const payroll = calculatePayrollPreview(policy);

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
                  <AppIcon name="salary" size={20} color="accent" />
                </View>

                <View style={styles.headerText}>
                  <AppText style={styles.title}>{t("payroll.salarySlip")}</AppText>
                  <AppText style={styles.subtitle}>
                    {payroll.profile.month}
                  </AppText>
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
              <View style={styles.employeeCard}>
                <View>
                  <AppText style={styles.employeeName}>
                    {payroll.profile.employeeName}
                  </AppText>
                  <AppText style={styles.employeeMeta}>
                    {payroll.profile.employeeId}
                  </AppText>
                </View>

                <View style={styles.statusBadge}>
                  <AppText style={styles.statusText}>{t("common.approved")}</AppText>
                </View>
              </View>

              <View style={styles.netCard}>
                <AppText style={styles.netLabel}>{t("payroll.netSalary")}</AppText>
                <AppText style={styles.netValue}>
                  {formatMoney(payroll.netPay, payroll.profile.currency)}
                </AppText>
                <AppText style={styles.netSubtitle}>
                  {t(getSalaryBasisLabelKey(payroll.basis))}
                </AppText>
              </View>

              <View style={styles.section}>
                <AppText style={styles.sectionTitle}>
                  {t("payroll.calculation")}
                </AppText>

                <View style={styles.card}>
                  <Row
                    label={t("payroll.monthlySalary")}
                    value={formatMoney(
                      payroll.profile.monthlySalary,
                      payroll.profile.currency
                    )}
                  />
                  <Row
                    label={t("payroll.salaryBasis")}
                    value={t(getSalaryBasisLabelKey(payroll.basis))}
                  />
                  <Row
                    label={t("payroll.divisor")}
                    value={`${payroll.divisor}`}
                  />
                  <Row
                    label={t("payroll.perDayRate")}
                    value={formatMoney(payroll.perDayRate, payroll.profile.currency)}
                  />
                  <Row
                    label={t("payroll.perHourRate")}
                    value={formatMoney(payroll.perHourRate, payroll.profile.currency)}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <AppText style={styles.sectionTitle}>
                  {t("payroll.earnings")}
                </AppText>

                <View style={styles.card}>
                  <Row
                    label={t("payroll.payableDays")}
                    value={`${payroll.profile.payableDays}`}
                  />
                  <Row
                    label={t("payroll.workedHours")}
                    value={`${payroll.profile.workedHours}`}
                  />
                  <Row
                    label={t("payroll.basePay")}
                    value={formatMoney(payroll.basePay, payroll.profile.currency)}
                  />
                  <Row
                    label={t("payroll.overtime")}
                    value={formatMoney(
                      payroll.overtimeAmount,
                      payroll.profile.currency
                    )}
                  />
                  <Row
                    label={t("payroll.allowances")}
                    value={formatMoney(
                      payroll.profile.allowances,
                      payroll.profile.currency
                    )}
                  />
                  <Row
                    label={t("payroll.grossPay")}
                    value={formatMoney(payroll.grossPay, payroll.profile.currency)}
                    strong
                  />
                </View>
              </View>

              <View style={styles.section}>
                <AppText style={styles.sectionTitle}>
                  {t("payroll.deductions")}
                </AppText>

                <View style={styles.card}>
                  <Row
                    label={t("payroll.deductions")}
                    value={formatMoney(
                      payroll.profile.deductions,
                      payroll.profile.currency
                    )}
                    danger
                  />
                  <Row
                    label={t("payroll.loanDeduction")}
                    value={formatMoney(
                      payroll.profile.loanDeduction,
                      payroll.profile.currency
                    )}
                    danger
                  />
                  <Row
                    label={t("payroll.totalDeductions")}
                    value={formatMoney(
                      payroll.totalDeductions,
                      payroll.profile.currency
                    )}
                    strong
                    danger
                  />
                </View>
              </View>

              <View style={styles.footerNote}>
                <AppIcon name="shield" size={17} color="accent" />
                <AppText style={styles.footerText}>
                  {t("payroll.policyNote")}
                </AppText>
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
    height: "82%",
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
    marginBottom: 10,
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
    paddingBottom: 24,
  },
  employeeCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  employeeName: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
  employeeMeta: {
    marginTop: 3,
    fontSize: 13,
    color: colors.textMuted,
  },
  statusBadge: {
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.accent,
  },
  netCard: {
    marginTop: 12,
    backgroundColor: colors.homeStatusBg,
    borderRadius: 24,
    padding: 18,
  },
  netLabel: {
    fontSize: 13,
    color: colors.homeStatusMutedText,
    marginBottom: 6,
  },
  netValue: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.inverseText,
  },
  netSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: colors.homeStatusMutedText,
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 14,
    gap: 12,
  },
  row: {
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  rowLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
  },
  rowValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "700",
    textAlign: "right",
  },
  rowValueStrong: {
    fontSize: 14,
    fontWeight: "900",
  },
  rowValueDanger: {
    color: colors.danger,
  },
  footerNote: {
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
});