import { ResolvedPolicy } from "../policies/types";
import { employeeSalaryProfile } from "./mockPayroll";

const roundMoney = (value: number) => Math.round(value);

export const formatMoney = (amount: number, currency = "PKR") => {
  return `${currency} ${roundMoney(amount).toLocaleString()}`;
};

export const getSalaryBasisLabelKey = (
  basis: ResolvedPolicy["payroll"]["salaryCalculationBasis"]
) => {
  if (basis === "calendar_days") return "payroll.calendarDaysBasis";
  if (basis === "working_days") return "payroll.workingDaysBasis";
  if (basis === "fixed_divisor") return "payroll.fixedDivisorBasis";
  return "payroll.hourlyBasis";
};

export const calculatePayrollPreview = (policy: ResolvedPolicy) => {
  const profile = employeeSalaryProfile;
  const monthlySalary = profile.monthlySalary;

  const basis = policy.payroll.salaryCalculationBasis;

  const divisor =
    basis === "calendar_days"
      ? profile.calendarDaysInPeriod
      : basis === "working_days"
        ? profile.workingDaysInPeriod
        : basis === "fixed_divisor"
          ? policy.payroll.fixedDivisor
          : policy.payroll.requiredMonthlyHours;

  const perDayRate =
    basis === "hourly"
      ? monthlySalary / profile.workingDaysInPeriod
      : monthlySalary / divisor;

  const perHourRate =
    basis === "hourly"
      ? monthlySalary / policy.payroll.requiredMonthlyHours
      : monthlySalary / policy.payroll.requiredMonthlyHours;

  const basePay =
    basis === "hourly"
      ? perHourRate * profile.workedHours
      : perDayRate * profile.payableDays;

  const overtimeAmount = policy.payroll.overtime.enabled
    ? perHourRate *
      profile.approvedOvertimeHours *
      policy.payroll.overtime.multiplier
    : 0;

  const grossPay = basePay + overtimeAmount + profile.allowances;

  const totalDeductions = profile.deductions + profile.loanDeduction;

  const netPay = grossPay - totalDeductions;

  return {
    profile,
    basis,
    divisor,
    perDayRate,
    perHourRate,
    basePay,
    overtimeAmount,
    grossPay,
    totalDeductions,
    netPay,
  };
};
