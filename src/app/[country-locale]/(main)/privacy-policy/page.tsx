import { getSettings } from "@/services/getSettings";

export default async function page({
  params,
}: {
  params: Promise<{ "country-locale": string }>;
}) {
  const { "country-locale": fullLocale } = await params;
  const lang = fullLocale.split("-")[0];

  const { data } = await getSettings(lang);

  return (
    <div
      className="container py-8 static_pages"
      dangerouslySetInnerHTML={{ __html: data.privacy_text }}
    />
  );
}
