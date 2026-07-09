import { ResolvedPolicy } from "../features/policies/types";

export const defaultPolicy: ResolvedPolicy = {
  modules: {
    attendance: {
      enabled: true,
      moduleType: "general",
      assignmentRequired: false,
      assigned: true,
    },
    deviceAttendance: {
      enabled: true,
      moduleType: "general",
      assignmentRequired: false,
      assigned: true,
    },
    remoteAttendance: {
      enabled: true,
      moduleType: "general",
      assignmentRequired: false,
      assigned: true,
    },
    fieldAttendance: {
      enabled: false,
      moduleType: "assigned",
      assignmentRequired: true,
      assignmentMode: "selected_employees",
      assigned: false,
      permissions: {
        captureLocation: true,
      },
    },
    breakTracking: {
      enabled: true,
      moduleType: "general",
      assignmentRequired: false,
      assigned: true,
    },
    leaveRequests: {
      enabled: true,
      moduleType: "general",
      assignmentRequired: false,
      assigned: true,
    },
    wfhRequests: {
      enabled: true,
      moduleType: "general",
      assignmentRequired: false,
      assigned: true,
    },
    loans: {
      enabled: true,
      moduleType: "general",
      assignmentRequired: false,
      assigned: true,
    },
    tickets: {
      enabled: true,
      moduleType: "general",
      assignmentRequired: false,
      assigned: true,
    },
    documents: {
      enabled: true,
      moduleType: "general",
      assignmentRequired: false,
      assigned: true,
    },
    payroll: {
      enabled: true,
      moduleType: "general",
      assignmentRequired: false,
      assigned: true,
    },
    salarySlips: {
      enabled: true,
      moduleType: "general",
      assignmentRequired: false,
      assigned: true,
    },
    notifications: {
      enabled: true,
      moduleType: "general",
      assignmentRequired: false,
      assigned: true,
    },

    sales: {
      enabled: false,
      moduleType: "assigned",
      assignmentRequired: true,
      assignmentMode: "selected_employees",
      assigned: false,
      permissions: {
        createSaleEntry: false,
        viewOwnSales: false,
        viewBranchSales: false,
        captureLocation: true,
        uploadAttachment: true,
      },
    },
    inventory: {
      enabled: false,
      moduleType: "assigned",
      assignmentRequired: true,
      assignmentMode: "selected_employees",
      assigned: false,
    },
    mediaTasks: {
      enabled: false,
      moduleType: "assigned",
      assignmentRequired: true,
      assignmentMode: "selected_employees",
      assigned: false,
    },
    delivery: {
      enabled: false,
      moduleType: "assigned",
      assignmentRequired: true,
      assignmentMode: "selected_employees",
      assigned: false,
    },
    inspection: {
      enabled: false,
      moduleType: "assigned",
      assignmentRequired: true,
      assignmentMode: "selected_employees",
      assigned: false,
    },
    siteVisits: {
      enabled: false,
      moduleType: "assigned",
      assignmentRequired: true,
      assignmentMode: "selected_employees",
      assigned: false,
    },
  },

  attendance: {
    deviceAttendance: {
      enabled: true,
      syncSource: "biometric_device",
    },
    remoteAttendance: {
      enabled: true,
      requiresApproval: true,
      requiresFaceVerification: true,
      allowCheckOutWithoutFace: false,
    },
    fieldAttendance: {
      enabled: false,
      requiresLocation: true,
      requiresSelfie: true,
      requiresPreciseLocation: true,
      maxLocationAccuracyMeters: 30,
    },
    breakTracking: {
      enabled: true,
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
      maxHoursPerDay: 3,
    },
  },
};
