"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getClientHomeCategories } from "@/features/home/service";
import { HomeFilterInterface, CategoryResponse } from "./types";

export default function useGetCategoriesWithPosts(filter: HomeFilterInterface) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<CategoryResponse>({
      queryKey: ["home-categories", filter],

      queryFn: ({ pageParam = 1 }) =>
        getClientHomeCategories(pageParam as number, filter),
      initialPageParam: 1,

      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (

          allPages.length === 1 &&
          allPages[0].data.posts.every((cat) => cat.posts.length === 0)
        ) {
          
          return undefined;
        }

        const posts = lastPage?.data?.posts ?? [];
        if (posts.length < 5) return undefined;

        return (lastPageParam as number) + 1;
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
