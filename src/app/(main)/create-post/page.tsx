import PostFormWrapper from "@/features/manage-post/PostFormWrapper";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const postType = params.postType as string;

  return <PostFormWrapper postType={postType} />;
}
