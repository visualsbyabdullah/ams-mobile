import { resolvePolicy } from "./resolvePolicy";
import { DeepPartial, ResolvedPolicy } from "./types";

export type PolicyScenarioKey =
  | "onsiteBranch"
  | "wfhBranch"
  | "breakBranch"
  | "noRequestsBranch"
  | "fullModulesBranch";

type PolicyScenario = {
  key: PolicyScenarioKey;
  titleKey: string;
  descriptionKey: string;
  policy: ResolvedPolicy;
};

const organizationBase: DeepPartial<ResolvedPolicy> = {
  modules: {
    attendance: { enabled: true },
    deviceAttendance: { enabled: true },
    remoteAttendance: { enabled: true },
    fieldAttendance: { enabled: false },
    breakTracking: { enabled: true },
    leaveRequests: { enabled: true },
    wfhRequests: { enabled: true },
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

const onsiteBranch: DeepPartial<ResolvedPolicy> = {
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
};

const wfhBranch: DeepPartial<ResolvedPolicy> = {
  modules: {
    remoteAttendance: { enabled: true },
    wfhRequests: { enabled: true },
    breakTracking: { enabled: false },
  },

  attendance: {
    remoteAttendance: {
      enabled: true,
      requiresApproval: true,
      requiresFaceVerification: true,
      allowCheckOutWithoutFace: true,
    },

    breakTracking: {
      enabled: false,
    },
  },
};

const breakBranch: DeepPartial<ResolvedPolicy> = {
  modules: {
    remoteAttendance: { enabled: false },
    wfhRequests: { enabled: false },
    breakTracking: { enabled: true },
  },

  attendance: {
    remoteAttendance: {
      enabled: false,
    },

    breakTracking: {
      enabled: true,
      source: "device_or_app",
      maxBreakMinutes: 60,
    },
  },
};

const noRequestsBranch: DeepPartial<ResolvedPolicy> = {
  modules: {
    leaveRequests: { enabled: false },
    wfhRequests: { enabled: false },
    loans: { enabled: false },
    tickets: { enabled: false },
    remoteAttendance: { enabled: false },
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
};

const fullModulesBranch: DeepPartial<ResolvedPolicy> = {
  modules: {
    remoteAttendance: { enabled: true },
    wfhRequests: { enabled: true },
    breakTracking: { enabled: true },
    leaveRequests: { enabled: true },
    loans: { enabled: true },
    tickets: { enabled: true },
    documents: { enabled: true },
    payroll: { enabled: true },
    salarySlips: { enabled: true },
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
};

export const policyScenarios: Record<PolicyScenarioKey, PolicyScenario> = {
  onsiteBranch: {
    key: "onsiteBranch",
    titleKey: "policyDebug.onsiteBranch",
    descriptionKey: "policyDebug.onsiteBranchDesc",
    policy: resolvePolicy(organizationBase, onsiteBranch),
  },

  wfhBranch: {
    key: "wfhBranch",
    titleKey: "policyDebug.wfhBranch",
    descriptionKey: "policyDebug.wfhBranchDesc",
    policy: resolvePolicy(organizationBase, wfhBranch),
  },

  breakBranch: {
    key: "breakBranch",
    titleKey: "policyDebug.breakBranch",
    descriptionKey: "policyDebug.breakBranchDesc",
    policy: resolvePolicy(organizationBase, breakBranch),
  },

  noRequestsBranch: {
    key: "noRequestsBranch",
    titleKey: "policyDebug.noRequestsBranch",
    descriptionKey: "policyDebug.noRequestsBranchDesc",
    policy: resolvePolicy(organizationBase, noRequestsBranch),
  },

  fullModulesBranch: {
    key: "fullModulesBranch",
    titleKey: "policyDebug.fullModulesBranch",
    descriptionKey: "policyDebug.fullModulesBranchDesc",
    policy: resolvePolicy(organizationBase, fullModulesBranch),
  },
};

export const policyScenarioList = Object.values(policyScenarios);
