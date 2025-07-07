import { getCategories } from "@/services/getCategories";
import { getQueryClient } from "@/utils/queryClient";
import { getFilteredPosts } from "@/features/listing/service";
import PageBanner from "@/components/shared/PageBanner";
import FilterSideBar from "@/features/listing/FilterSideBar";
import PostsList from "@/features/listing/PostsList";

export default async function page() {
  const queryClient = getQueryClient();
  const { data: categories } = await getCategories();

  await queryClient.prefetchInfiniteQuery({
      queryKey: ["all-posts"],
      queryFn: ({ pageParam = 1 }) => getFilteredPosts(pageParam),
      initialPageParam: 1,
      getNextPageParam: (
        lastPage: CategoryResponse,
        _: unknown,
        lastPageParam: number
      ) => {
        const posts = lastPage?.data?.posts ?? [];
        if (posts.length === 0) return undefined;
        return lastPageParam + 1;
      },
    });


  return (
    <>
      <PageBanner links={[{ title: "Home", link: "/" }]} page="All Posts" />

      <div className="container py-6">
        <div className="flex flex-wrap -mx-2">
          <div className="w-full lg:w-3/12 px-2 py-2">
            <FilterSideBar categories={categories} />
          </div>

          <div className="w-full lg:w-9/12 px-2 py-2">
            <PostsList />
          </div>
        </div>
      </div>
    </>
  );
}
