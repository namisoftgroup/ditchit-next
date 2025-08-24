"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getClientFilteredPosts } from "@/features/listing/service";
import { PostsFilterPayload } from "@/features/listing/types";
import useUrlFilters from "@/hooks/useFilterParams";

export default function useGetPostsList(userId: number | null) {

  console.log(userId);
  
  const { getParam } = useUrlFilters();

  const category = getParam("category_id");
  const search = getParam("search");
  const sort = getParam("sort");
  const priceFrom = getParam("price_from");
  const priceTo = getParam("price_to");
  const condition = getParam("condition");

  const filterBase: Omit<PostsFilterPayload, "page"> = {
    search: search,
    sort: sort,
    condition: condition,
    category_id: category,
    price_from: priceFrom,
    price_to: priceTo,
    user_id: userId
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", filterBase],
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
