import { getQueryClient } from "@/utils/queryClient";
import { getHomeCategories } from "@/features/home/service";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CategoryResponse } from "@/features/home/types";
import CategoriesList from "@/features/home/CategoriesList";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["home-categories"],
    queryFn: ({ pageParam = 1 }) => getHomeCategories(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: CategoryResponse) => {
      const nextUrl = lastPage?.data?.links?.next;
      return nextUrl
        ? Number(new URL(nextUrl).searchParams.get("page"))
        : undefined;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesList />
    </HydrationBoundary>
  );
}
