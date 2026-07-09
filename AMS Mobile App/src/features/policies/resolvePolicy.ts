import { defaultPolicy } from "../../config/defaultPolicy";
import { DeepPartial, ResolvedPolicy } from "./types";

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const mergePolicy = <T extends Record<string, any>>(
  base: T,
  override?: DeepPartial<T>
): T => {
  if (!override) return base;

  const output = { ...base };

  Object.keys(override).forEach((key) => {
    const overrideValue = override[key as keyof typeof override];
    const baseValue = base[key as keyof T];

    if (isObject(baseValue) && isObject(overrideValue)) {
      output[key as keyof T] = mergePolicy(baseValue, overrideValue as any);
      return;
    }

    if (overrideValue !== undefined) {
      output[key as keyof T] = overrideValue as T[keyof T];
    }
  });

  return output;
};

export const resolvePolicy = (
  organizationPolicy?: DeepPartial<ResolvedPolicy>,
  branchPolicy?: DeepPartial<ResolvedPolicy>,
  employeePolicy?: DeepPartial<ResolvedPolicy>
): ResolvedPolicy => {
  const withOrganization = mergePolicy(defaultPolicy, organizationPolicy);
  const withBranch = mergePolicy(withOrganization, branchPolicy);
  return mergePolicy(withBranch, employeePolicy);
};
