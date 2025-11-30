import { getSettings } from "@/services/getSettings";

export default async function page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { data } = await getSettings(locale);
  return (
    <div
      className="container py-8 static_pages"
      dangerouslySetInnerHTML={{ __html: data.terms_text }}
    />
  );
}
