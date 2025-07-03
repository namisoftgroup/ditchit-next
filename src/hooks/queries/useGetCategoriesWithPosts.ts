"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getClientHomeCategories } from "@/features/home/service";

export default function useGetCategoriesWithPosts() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["home-categories"],

      queryFn: ({ pageParam = 1 }) => getClientHomeCategories(pageParam),
      initialPageParam: 1,

      getNextPageParam: (lastPage, _, lastPageParam) => {
        const posts = lastPage?.data?.posts ?? [];
        if (posts.length === 0) return undefined;
        return lastPageParam + 1;
      },
    });

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    categories: data?.pages.flatMap((page) => page.data?.posts ?? []) ?? [],
  };
}
