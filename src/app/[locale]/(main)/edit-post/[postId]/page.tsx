import { getPostDetails } from "@/features/post-details/service";
import PostFormWrapper from "@/features/manage-post/PostFormWrapper";

interface PageProps {
  params: Promise<{
    postId: string;
  }>;
}

export default async function page({ params }: PageProps) {
  const id = (await params).postId;
  const post = await getPostDetails(id);

  return <PostFormWrapper post={post} />;
}
