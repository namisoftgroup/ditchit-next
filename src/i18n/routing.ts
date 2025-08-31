import { defineRouting } from "next-intl/routing";

const ISO_CODES = ["US", "CA", "IN"];

const LOCALES = [
  "af",
  "am",
  "ar",
  "az",
  "bg",
  "bn",
  "ca",
  "cs",
  "da",
  "de",
  "el",
  "en",
  "es",
  "et",
  "fa",
  "fi",
  "fil",
  "fr",
  "gu",
  "hi",
  "hr",
  "hu",
  "id",
  "it",
  "ja",
  "kk",
  "kn",
  "ko",
  "lo",
  "lt",
  "lv",
  "mk",
  "ml",
  "mr",
  "ms",
  "nb",
  "nl",
  "pa",
  "pl",
  "pt",
  "ro",
  "ru",
  "sk",
  "sl",
  "sq",
  "sr",
  "sv",
  "sw",
  "ta",
  "te",
  "th",
  "tr",
  "uk",
  "uz",
  "vi",
  "zh",
];

const FULL_LOCALES: string[] = [];

LOCALES.forEach((locale) => {
  ISO_CODES.forEach((code) => {
    FULL_LOCALES.push(`${locale}-${code}`);
  });
});

export const routing = defineRouting({
  locales: FULL_LOCALES,
  defaultLocale: "en-us",
  localePrefix: "always",
});
