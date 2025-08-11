"use client";

import { getAdvertiserPosts } from "@/features/advertiser/service";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useGetAdvertiserPosts(advertiserId: string) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["advertiser-posts", advertiserId],

      queryFn: ({ pageParam = 1 }) =>
        getAdvertiserPosts(advertiserId, pageParam),
      initialPageParam: 1,

      getNextPageParam: (lastPage, _, lastPageParam) => {
        const posts = lastPage?.data?.posts ?? [];
        if (posts.length === 0) return undefined;
        return lastPageParam + 1;
      },
    });

  return {
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    posts: data?.pages.flatMap((page) => page.data?.posts ?? []) ?? [],
    user: data?.pages[0]?.data?.user?.user,
  };
}
