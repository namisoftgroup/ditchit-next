import { getQueryClient } from "@/utils/queryClient";
import { getHomeCategories } from "@/features/home/service";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CategoryResponse } from "@/features/home/types";
import CategoriesList from "@/features/home/components/CategoriesList";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["home-categories"],
    queryFn: ({ pageParam = 1 }) => getHomeCategories(pageParam),
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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesList />
    </HydrationBoundary>
  );
}
