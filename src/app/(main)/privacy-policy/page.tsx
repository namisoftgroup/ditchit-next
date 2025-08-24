import { getSettings } from "@/services/getSettings";

export default async function page() {
  const { data } = await getSettings();
  
  return (
    <div
      className="container py-8 static_pages"
      dangerouslySetInnerHTML={{ __html: data.privacy_text }}
    />
  );
}
