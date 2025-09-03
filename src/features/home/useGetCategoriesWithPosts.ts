"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getClientHomeCategories } from "@/features/home/service";
import { HomeFilterInterface } from "./types";

export default function useGetCategoriesWithPosts(filter: HomeFilterInterface) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["home-categories", filter],

      queryFn: ({ pageParam = 1 }) =>
        getClientHomeCategories(pageParam, filter),
      initialPageParam: 1,

      getNextPageParam: (lastPage, _, lastPageParam) => {
        const posts = lastPage?.data?.posts ?? [];
        if (posts.length < 5) return undefined;
        return lastPageParam + 1;
      },
    });

  const categories =
    data?.pages.flatMap((page) => page.data?.posts ?? []) ?? [];

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    categories,
  };
}
