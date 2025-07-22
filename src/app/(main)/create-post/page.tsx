import CreatePostForm from "@/features/manage-post/CreatePostForm";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const postType = params.postType as string;

  return <CreatePostForm postType={postType} />;
}
