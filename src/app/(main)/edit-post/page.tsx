import EditPostForm from "@/features/manage-post/EditPostForm";

interface PageProps {
  params: Promise<{
    postId: string;
  }>;
}

export default async function page({ params }: PageProps) {
  const id = (await params).postId;

  return <EditPostForm id={id} />;
}
