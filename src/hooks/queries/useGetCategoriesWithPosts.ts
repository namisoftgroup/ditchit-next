import { useInfiniteQuery } from "@tanstack/react-query";
import { getHomeCategories } from "@/features/home/service";

export default function useGetCategoriesWithPosts() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["home-categories"],
    queryFn: ({ pageParam = 1 }) => getHomeCategories(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextUrl = lastPage?.data?.links?.next;
      if (!nextUrl) return undefined;
      const page = new URL(nextUrl).searchParams.get("page");
      return page ? Number(page) : undefined;
    },
  });

  return {
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    categories: data?.pages.flatMap((page) => page.data?.posts ?? []) ?? [],
  };
}
