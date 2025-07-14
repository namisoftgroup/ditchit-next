"use client";

import { getMyPosts } from "@/features/profile/service";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useGetMyPosts() {
  const { data, fetchNextPage, hasNextPage,isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["my-posts"],

      queryFn: ({ pageParam = 1 }) => getMyPosts(pageParam),
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
