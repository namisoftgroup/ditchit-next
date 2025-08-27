import { defineRouting } from "next-intl/routing";

export const LOCALES = ["en", "ar"];
export const DEFAULT_LOCALE = "en";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
});
