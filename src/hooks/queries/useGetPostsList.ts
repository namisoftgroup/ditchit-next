"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getClientFilteredPosts } from "@/features/listing/service";
import { PostsFilterPayload } from "@/features/listing/types";
import useUrlFilters from "@/hooks/utils/useFilterParams";

export default function useGetPostsList() {
  const { getParam } = useUrlFilters();

  const category = getParam("category_id");
  const sort = getParam("sort");

  const filterBase: Omit<PostsFilterPayload, "page"> = {
    category_id: category,
    sort: sort,
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["all-posts", filterBase],
      queryFn: ({ pageParam = 1 }) =>
        getClientFilteredPosts({
          ...filterBase,
          page: pageParam,
        }),

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
