import { DeepPartial, ResolvedPolicy } from "./types";
import { resolvePolicy } from "./resolvePolicy";

export const organizationPolicy: DeepPartial<ResolvedPolicy> = {
  modules: {
    attendance: { enabled: true },
    deviceAttendance: { enabled: true },
    remoteAttendance: { enabled: true },
    wfhRequests: { enabled: true },
    breakTracking: { enabled: true },
    leaveRequests: { enabled: true },
    loans: { enabled: true },
    tickets: { enabled: true },
    documents: { enabled: true },
    payroll: { enabled: true },
    salarySlips: { enabled: true },
    notifications: { enabled: true },
  },

  attendance: {
    remoteAttendance: {
      enabled: true,
      requiresApproval: true,
      requiresFaceVerification: true,
      allowCheckOutWithoutFace: true,
    },

    breakTracking: {
      enabled: true,
      source: "device_or_app",
      maxBreakMinutes: 45,
    },
  },

  schedule: {
    workingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },

    defaultShift: {
      start: "10:00",
      end: "18:00",
    },
  },

  payroll: {
    enabled: true,
    salaryCalculationBasis: "working_days",
    fixedDivisor: 26,
    requiredMonthlyHours: 160,

    overtime: {
      enabled: true,
      requiresApproval: true,
      multiplier: 1.5,
      maxHoursPerDay: 2,
    },
  },
};

export const branchPolicy: DeepPartial<ResolvedPolicy> = {
  modules: {
    remoteAttendance: { enabled: false },
    wfhRequests: { enabled: false },
    breakTracking: { enabled: false },
  },

  attendance: {
    remoteAttendance: {
      enabled: false,
    },

    breakTracking: {
      enabled: false,
    },
  },

  schedule: {
    workingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },

    defaultShift: {
      start: "09:00",
      end: "17:00",
    },
  },

  payroll: {
    salaryCalculationBasis: "fixed_divisor",
    fixedDivisor: 26,
  },
};

export const employeePolicy: DeepPartial<ResolvedPolicy> = {};

export const currentEmployeePolicy = resolvePolicy(
  organizationPolicy,
  branchPolicy,
  employeePolicy
);
