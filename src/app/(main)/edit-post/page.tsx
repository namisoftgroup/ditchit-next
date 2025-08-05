import PostFormWrapper from "@/features/manage-post/PostFormWrapper";

interface PageProps {
  params: Promise<{
    postId: string;
  }>;
}

export default async function page({ params }: PageProps) {
  const id = (await params).postId;

  return <PostFormWrapper postId={id} />;
}
