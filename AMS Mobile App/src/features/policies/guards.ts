import {
  ModuleKey,
  ModulePermissionKey,
  ResolvedPolicy,
  WeekDayKey,
} from "./types";

export const isModuleVisible = (
  policy: ResolvedPolicy,
  module: ModuleKey
) => {
  const modulePolicy = policy.modules[module];

  if (!modulePolicy?.enabled) {
    return false;
  }

  if (modulePolicy.assignmentRequired) {
    return modulePolicy.assigned === true;
  }

  return true;
};

export const isModuleEnabled = (
  policy: ResolvedPolicy,
  module: ModuleKey
) => {
  return isModuleVisible(policy, module);
};

export const isModuleAssigned = (
  policy: ResolvedPolicy,
  module: ModuleKey
) => {
  const modulePolicy = policy.modules[module];

  if (!modulePolicy) {
    return false;
  }

  if (!modulePolicy.assignmentRequired) {
    return true;
  }

  return modulePolicy.assigned === true;
};

export const hasModulePermission = (
  policy: ResolvedPolicy,
  module: ModuleKey,
  permission: ModulePermissionKey
) => {
  if (!isModuleVisible(policy, module)) {
    return false;
  }

  return policy.modules[module].permissions?.[permission] === true;
};

export const canUseDeviceAttendance = (policy: ResolvedPolicy) => {
  return (
    isModuleVisible(policy, "attendance") &&
    isModuleVisible(policy, "deviceAttendance") &&
    policy.attendance.deviceAttendance.enabled
  );
};

export const canUseRemoteAttendance = (policy: ResolvedPolicy) => {
  return (
    isModuleVisible(policy, "attendance") &&
    isModuleVisible(policy, "remoteAttendance") &&
    policy.attendance.remoteAttendance.enabled
  );
};

export const canRequestWfh = (policy: ResolvedPolicy) => {
  return (
    isModuleVisible(policy, "wfhRequests") &&
    policy.attendance.remoteAttendance.enabled
  );
};

export const canUseFieldAttendance = (policy: ResolvedPolicy) => {
  return (
    isModuleVisible(policy, "attendance") &&
    isModuleVisible(policy, "fieldAttendance") &&
    policy.attendance.fieldAttendance.enabled
  );
};

export const canUseBreakTracking = (policy: ResolvedPolicy) => {
  return (
    isModuleVisible(policy, "breakTracking") &&
    policy.attendance.breakTracking.enabled
  );
};

export const canUsePayroll = (policy: ResolvedPolicy) => {
  return isModuleVisible(policy, "payroll") && policy.payroll.enabled;
};

export const canUseSales = (policy: ResolvedPolicy) => {
  return isModuleVisible(policy, "sales");
};

export const canCreateSaleEntry = (policy: ResolvedPolicy) => {
  return hasModulePermission(policy, "sales", "createSaleEntry");
};

export const canViewOwnSales = (policy: ResolvedPolicy) => {
  return hasModulePermission(policy, "sales", "viewOwnSales");
};

export const canViewBranchSales = (policy: ResolvedPolicy) => {
  return hasModulePermission(policy, "sales", "viewBranchSales");
};

export const getWorkingDays = (policy: ResolvedPolicy) => {
  return (Object.keys(policy.schedule.workingDays) as WeekDayKey[]).filter(
    (day) => policy.schedule.workingDays[day]
  );
};
