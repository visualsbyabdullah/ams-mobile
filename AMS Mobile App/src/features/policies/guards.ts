import { ModuleKey, ResolvedPolicy, WeekDayKey } from "./types";

export const isModuleEnabled = (
  policy: ResolvedPolicy,
  module: ModuleKey
) => {
  return policy.modules[module]?.enabled === true;
};

export const canUseDeviceAttendance = (policy: ResolvedPolicy) => {
  return (
    isModuleEnabled(policy, "attendance") &&
    isModuleEnabled(policy, "deviceAttendance") &&
    policy.attendance.deviceAttendance.enabled
  );
};

export const canUseRemoteAttendance = (policy: ResolvedPolicy) => {
  return (
    isModuleEnabled(policy, "attendance") &&
    isModuleEnabled(policy, "remoteAttendance") &&
    policy.attendance.remoteAttendance.enabled
  );
};

export const canRequestWfh = (policy: ResolvedPolicy) => {
  return (
    isModuleEnabled(policy, "wfhRequests") &&
    canUseRemoteAttendance(policy)
  );
};

export const canUseFieldAttendance = (policy: ResolvedPolicy) => {
  return (
    isModuleEnabled(policy, "attendance") &&
    isModuleEnabled(policy, "fieldAttendance") &&
    policy.attendance.fieldAttendance.enabled
  );
};

export const canUseBreakTracking = (policy: ResolvedPolicy) => {
  return (
    isModuleEnabled(policy, "breakTracking") &&
    policy.attendance.breakTracking.enabled
  );
};

export const canUsePayroll = (policy: ResolvedPolicy) => {
  return isModuleEnabled(policy, "payroll") && policy.payroll.enabled;
};

export const getWorkingDays = (policy: ResolvedPolicy): WeekDayKey[] => {
  return Object.entries(policy.schedule.workingDays)
    .filter(([, enabled]) => enabled)
    .map(([day]) => day as WeekDayKey);
};
