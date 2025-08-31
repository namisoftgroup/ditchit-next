import PostFormWrapper from "@/features/manage-post/PostFormWrapper";

export default async function page({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ "country-locale": string }>;
}) {
  const sParams = await searchParams;
  const type = sParams.type as string;

  const { "country-locale": fullLocale } = await params;
  const lang = fullLocale.split("-")[0];

  return <PostFormWrapper type={type} lang={lang} />;
}
