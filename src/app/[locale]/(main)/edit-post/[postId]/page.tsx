import { getPostDetails } from "@/features/post-details/service";
import PostFormWrapper from "@/features/manage-post/PostFormWrapper";

interface PageProps {
  params: Promise<{
    postId: string;
    locale: string;
  }>;
}

export default async function page({ params }: PageProps) {
  const id = (await params).postId;
  const post = await getPostDetails(id);
  const { locale } = await params;

  return <PostFormWrapper post={post} lang={locale} />;
}
