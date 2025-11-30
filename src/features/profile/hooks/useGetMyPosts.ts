"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyPostsClient } from "../service";

export default function useGetMyPosts() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["my-posts"],

      queryFn: ({ pageParam = 1 }) => getMyPostsClient(pageParam),
      initialPageParam: 1,

      getNextPageParam: (lastPage, _, lastPageParam) => {
        const posts = lastPage?.data ?? [];
        if (posts.length === 0) return undefined;
        return lastPageParam + 1; },
    });

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    posts: data?.pages.flatMap((page) => page.data ?? []) ?? [],
  };
}
