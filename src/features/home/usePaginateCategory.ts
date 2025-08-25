"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getCategoryPosts } from "@/features/home/service";
import { HomeFilterInterface } from "./types";

export default function usePaginateCategory(
  categoryId: number,
  filterParams: HomeFilterInterface,
  enabled: boolean | undefined
) {
  const query = useInfiniteQuery({
    queryKey: ["category-posts", categoryId, filterParams],

    queryFn: ({ pageParam = 2 }) =>
      getCategoryPosts(pageParam, categoryId, filterParams),

    initialPageParam: 2,

    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage?.data || lastPage.data.length === 0) {
        return null;
      }

      return lastPageParam + 1;
    },

    enabled,
  });

  const posts = query.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    posts,
    ...query,
  };
}
