import { en, type MessageKey } from "./en";
import { tr } from "./tr";

export type Locale = "en" | "tr";

export const messages = { en, tr } as const;

export function t(locale: Locale, key: MessageKey): string {
  const value: string | undefined = messages[locale][key];
  if (!value) throw new Error(`Missing ${locale} message: ${key}`);
  return value;
}

export function formatMessage(
  locale: Locale,
  key: MessageKey,
  values: Readonly<Record<string, string>>,
): string {
  return t(locale, key).replace(
    /\{(\w+)\}/g,
    (placeholder, name: string) => values[name] ?? placeholder,
  );
}

export function localeFromPath(pathname: string): Locale {
  return pathname === "/tr" || pathname.startsWith("/tr/") ? "tr" : "en";
}

export function pathForLocale(locale: Locale): string {
  return `/${locale}`;
}

export type { MessageKey };
