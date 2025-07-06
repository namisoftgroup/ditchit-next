import { getProductDetails } from "@/features/product-details/service";
import PageBanner from "@/components/shared/PageBanner";

interface PostDetailsParams {
  productId: string;
}

export default async function PostDetails({
  params,
}: {
  params: PostDetailsParams;
}) {
  const id = Number(params.productId);
  const post = await getProductDetails(id);
  return (
    <>
      <PageBanner
        links={[
          { title: "Home", link: "/" },
          { title: "All Posts", link: "/all-posts" },
        ]}
        page={post.title}
      />

      <div className="container">{post.title}</div>
    </>
  );
}
