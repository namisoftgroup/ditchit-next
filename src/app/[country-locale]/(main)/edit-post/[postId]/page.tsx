import { getPostDetails } from "@/features/post-details/service";
import PostFormWrapper from "@/features/manage-post/PostFormWrapper";

interface PageProps {
  params: Promise<{
    postId: string;
    "country-locale": string;
  }>;
} 

export default async function page({ params }: PageProps) {
  const id = (await params).postId;
  const post = await getPostDetails(id);
  const { "country-locale": fullLocale } = await params;
  const lang = fullLocale.split("-")[0];

  return <PostFormWrapper post={post} lang={lang} />;
}
