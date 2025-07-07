"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getClientFilteredPosts } from "@/features/listing/service";

export default function useGetPostsList() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["all-posts"],

      queryFn: ({ pageParam = 1 }) => getClientFilteredPosts(pageParam),
      initialPageParam: 1,

      getNextPageParam: (lastPage, _, lastPageParam) => {
        const posts = lastPage?.data ?? [];
        if (posts.length === 0) return undefined;
        return lastPageParam + 1;
      },
    });

  return {
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    posts: data?.pages.flatMap((page) => page.data ?? []) ?? [],
  };
}
