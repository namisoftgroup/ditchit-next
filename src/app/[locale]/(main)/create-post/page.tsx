import PostFormWrapper from "@/features/manage-post/PostFormWrapper";

export default async function page({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}) {
  const sParams = await searchParams;
  const type = sParams.type as string;

  const { locale } = await params;

  return <PostFormWrapper type={type} lang={locale} />;
}
