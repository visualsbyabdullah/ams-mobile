import { defaultPolicy } from "../../config/defaultPolicy";
import { DeepPartial, ResolvedPolicy } from "./types";

type PolicyOverride = DeepPartial<ResolvedPolicy>;

const isPlainObject = (value: unknown) => {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
};

const clone = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value)) as T;
};

const mergeDeep = <T>(base: T, override?: DeepPartial<T>): T => {
  if (!override) {
    return clone(base);
  }

  if (!isPlainObject(base) || !isPlainObject(override)) {
    return clone(override as T);
  }

  const result: Record<string, unknown> = {
    ...(base as Record<string, unknown>),
  };

  Object.entries(override as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    const currentValue = result[key];

    if (isPlainObject(currentValue) && isPlainObject(value)) {
      result[key] = mergeDeep(currentValue, value as DeepPartial<typeof currentValue>);
      return;
    }

    result[key] = clone(value);
  });

  return result as T;
};

export function resolvePolicy(): ResolvedPolicy;
export function resolvePolicy(overrides: PolicyOverride[]): ResolvedPolicy;
export function resolvePolicy(override: PolicyOverride): ResolvedPolicy;
export function resolvePolicy(
  override: PolicyOverride,
  ...overrides: PolicyOverride[]
): ResolvedPolicy;
export function resolvePolicy(
  first?: PolicyOverride | PolicyOverride[],
  ...rest: PolicyOverride[]
): ResolvedPolicy {
  const overrides = Array.isArray(first)
    ? first
    : [first, ...rest].filter(Boolean) as PolicyOverride[];

  return overrides.reduce<ResolvedPolicy>((currentPolicy, override) => {
    return mergeDeep(currentPolicy, override);
  }, clone(defaultPolicy));
}
