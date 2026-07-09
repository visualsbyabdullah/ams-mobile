export type WeekDayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type ModuleKey =
  | "attendance"
  | "deviceAttendance"
  | "remoteAttendance"
  | "fieldAttendance"
  | "breakTracking"
  | "leaveRequests"
  | "wfhRequests"
  | "loans"
  | "tickets"
  | "documents"
  | "payroll"
  | "salarySlips"
  | "notifications"
  | "sales"
  | "inventory"
  | "mediaTasks"
  | "delivery"
  | "inspection"
  | "siteVisits";

export type SalaryCalculationBasis =
  | "calendar_days"
  | "working_days"
  | "fixed_divisor"
  | "hourly";

export type ModuleType = "general" | "assigned";

export type ModuleAssignmentMode =
  | "all_branch_employees"
  | "selected_roles"
  | "selected_employees";

export type ModulePermissionKey =
  | "createSaleEntry"
  | "viewOwnSales"
  | "viewBranchSales"
  | "createEntry"
  | "viewOwnEntries"
  | "viewBranchEntries"
  | "uploadAttachment"
  | "captureLocation";

export type ModulePolicy = {
  enabled: boolean;
  moduleType?: ModuleType;
  assignmentRequired?: boolean;
  assignmentMode?: ModuleAssignmentMode;
  assigned?: boolean;
  permissions?: Partial<Record<ModulePermissionKey, boolean>>;
};

export type AttendancePolicy = {
  deviceAttendance: {
    enabled: boolean;
    syncSource: "biometric_device" | "facial_device" | "mixed_device";
  };
  remoteAttendance: {
    enabled: boolean;
    requiresApproval: boolean;
    requiresFaceVerification: boolean;
    allowCheckOutWithoutFace: boolean;
  };
  fieldAttendance: {
    enabled: boolean;
    requiresLocation: boolean;
    requiresSelfie: boolean;
    requiresPreciseLocation?: boolean;
    maxLocationAccuracyMeters?: number;
  };
  breakTracking: {
    enabled: boolean;
    source: "device" | "app" | "device_or_app";
    maxBreakMinutes: number;
  };
};

export type SchedulePolicy = {
  workingDays: Record<WeekDayKey, boolean>;
  defaultShift: {
    start: string;
    end: string;
  };
  allowBranchOverride: boolean;
  allowEmployeeOverride: boolean;
  allowOvertimeSchedule: boolean;
};

export type PayrollPolicy = {
  enabled: boolean;
  salaryCalculationBasis: SalaryCalculationBasis;
  fixedDivisor: number;
  requiredMonthlyHours: number;
  countNonWorkingDaysAsPaid: boolean;
  countPublicHolidaysAsPaid: boolean;
  overtime: {
    enabled: boolean;
    requiresApproval: boolean;
    multiplier: number;
    maxHoursPerDay: number;
  };
};

export type ResolvedPolicy = {
  modules: Record<ModuleKey, ModulePolicy>;
  attendance: AttendancePolicy;
  schedule: SchedulePolicy;
  payroll: PayrollPolicy;
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
