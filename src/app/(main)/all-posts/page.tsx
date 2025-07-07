import { getCategories } from "@/services/getCategories";
import { getQueryClient } from "@/utils/queryClient";
import { getFilteredPosts } from "@/features/listing/service";
import { listingResponse } from "@/features/listing/types";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import PageBanner from "@/components/shared/PageBanner";
import FilterSideBar from "@/features/listing/FilterSideBar";
import PostsList from "@/features/listing/PostsList";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const sort = typeof params.sort === "string" ? params.sort : null;
  const category_id = typeof params.category_id === "string" ? params.category_id : null;

  const { data: categories } = await getCategories();
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["all-posts", { sort, category_id }],
    queryFn: ({ pageParam = 1 }) =>
      getFilteredPosts({
        page: pageParam,
        sort,
        category_id,
      }),
    initialPageParam: 1,
    getNextPageParam: (
      lastPage: listingResponse,
      _: unknown,
      lastPageParam: number
    ) => {
      const posts = lastPage?.data ?? [];
      if (posts.length === 0) return undefined;
      return lastPageParam + 1;
    },
  });

  return (
    <>
      <PageBanner links={[{ title: "Home", link: "/" }]} page="All Posts" />

      <div className="container py-4">
        <div className="flex flex-wrap -mx-2">
          <div className="w-full lg:w-3/12 px-2 pb-2 pt-4">
            <FilterSideBar categories={categories} />
          </div>

          <div className="w-full lg:w-9/12 px-2 py-2">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <PostsList />
            </HydrationBoundary>
          </div>
        </div>
      </div>
    </>
  );
}
