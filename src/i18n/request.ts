import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  let fullLocale = requested;
  if (!fullLocale || !routing.locales.includes(fullLocale)) {
    const matching = routing.locales.find((l) =>
      l.toLowerCase().startsWith(requested?.toLowerCase() ?? "")
    );
    fullLocale = matching ?? routing.defaultLocale;
  }

  const parts = fullLocale.split("-");
  let fileName: string | null = null;

  try {
    fileName = parts.slice(0, -1).join("-");
    const messages = (await import(`../../messages/${fileName}.json`)).default;
    return { locale: fullLocale, messages };
  } catch {}

  if (parts.length > 2) {
    try {
      fileName = parts.slice(0, -2).join("-");
      const messages = (await import(`../../messages/${fileName}.json`))
        .default;
      return { locale: fullLocale, messages };
    } catch {}
  }

  const messages = (
    await import(`../../messages/${routing.defaultLocale}.json`)
  ).default;
  return { locale: fullLocale, messages };
});
