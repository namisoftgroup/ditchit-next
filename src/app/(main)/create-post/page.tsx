import PostFormWrapper from "@/features/manage-post/PostFormWrapper";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const type = params.type as string;

  return <PostFormWrapper type={type} />;
}
