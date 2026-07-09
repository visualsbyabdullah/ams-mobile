import { ResolvedPolicy } from "../features/policies/types";

export const defaultPolicy: ResolvedPolicy = {
  modules: {
    attendance: { enabled: true },
    deviceAttendance: { enabled: true },
    remoteAttendance: { enabled: false },
    fieldAttendance: { enabled: false },
    breakTracking: { enabled: false },
    leaveRequests: { enabled: true },
    wfhRequests: { enabled: false },
    loans: { enabled: true },
    tickets: { enabled: true },
    documents: { enabled: true },
    payroll: { enabled: true },
    salarySlips: { enabled: true },
    notifications: { enabled: true },
  },

  attendance: {
    deviceAttendance: {
      enabled: true,
      syncSource: "biometric_device",
    },

    remoteAttendance: {
      enabled: false,
      requiresApproval: true,
      requiresFaceVerification: true,
      allowCheckOutWithoutFace: true,
    },

    fieldAttendance: {
      enabled: false,
      requiresLocation: true,
      requiresSelfie: true,
    },

    breakTracking: {
      enabled: false,
      source: "device_or_app",
      maxBreakMinutes: 60,
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

    allowBranchOverride: true,
    allowEmployeeOverride: true,
    allowOvertimeSchedule: true,
  },

  payroll: {
    enabled: true,
    salaryCalculationBasis: "working_days",
    fixedDivisor: 26,
    requiredMonthlyHours: 160,
    countNonWorkingDaysAsPaid: false,
    countPublicHolidaysAsPaid: true,

    overtime: {
      enabled: true,
      requiresApproval: true,
      multiplier: 1.5,
      maxHoursPerDay: 2,
    },
  },
};
