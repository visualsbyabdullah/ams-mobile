import { en } from "./en";

type TranslationTree = Record<string, unknown>;

const getValueByPath = (source: TranslationTree, path: string) => {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as TranslationTree)[key];
    }

    return undefined;
  }, source);
};

export const t = (key: string): string => {
  const value = getValueByPath(en, key);

  if (typeof value === "string") {
    return value;
  }

  return key;
};

export { en };
