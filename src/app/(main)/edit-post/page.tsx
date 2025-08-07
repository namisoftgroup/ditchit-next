import { getPostDetails } from "@/features/post-details/service";
import PostFormWrapper from "@/features/manage-post/PostFormWrapper";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const id = params.post_id as string;
  const post = await getPostDetails(id);

  return <PostFormWrapper post={post} />;
}
