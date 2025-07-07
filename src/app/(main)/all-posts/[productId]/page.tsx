import { getProductDetails } from "@/features/product-details/service";
import { notFound } from "next/navigation";
import PageBanner from "@/components/shared/PageBanner";
import PostOwnerCard from "@/features/product-details/PostOwnerCard";
import DitchNote from "@/features/product-details/DitchNote";
import PostSlider from "@/features/product-details/PostSlider";
import PostInfo from "@/features/product-details/PostInfo";

interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function PostDetails({ params }: PageProps) {
  const id = (await params).productId;
  const post = await getProductDetails(id);

  const images: string[] = [
    ...(post.image ? [post.image] : []),
    ...post.images.map(({ image }) => image),
  ];

  if (!post) {
    notFound();
  }

  return (
    <>
      <PageBanner
        links={[
          { title: "Home", link: "/" },
          { title: "All Posts", link: "/all-posts" },
        ]}
        page={post.title}
      />

      <div className="container py-6">
        <div className="flex flex-wrap -mx-2">
          <div className="w-full lg:w-8/12 px-2 py-2 flex flex-col gap-6">
            <PostSlider images={images} />
            <PostInfo post={post} />
          </div>

          <div className="w-full lg:w-4/12 px-2 py-2 flex flex-col gap-6">
            <PostOwnerCard owner={post.user.user} postId={post.id} />
            <DitchNote />
          </div>
        </div>
      </div>
    </>
  );
}
