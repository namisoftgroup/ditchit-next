"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getClientFilteredPosts } from "@/features/listing/service";
import { PostsFilterPayload } from "@/features/listing/types";
import useUrlFilters from "@/hooks/useFilterParams";

export default function useGetPostsList(
  userId: number | null,
  longitude: string | null,
  latitude: string | null,
  kilometers: string | null,
  delivery_method: string | null,
  country_id: string | null
) {
  const { getParam } = useUrlFilters();

  const filterBase: Omit<PostsFilterPayload, "page"> = useMemo(
    () => ({
      search: getParam("search"),
      sort: getParam("sort"),
      condition: getParam("condition"),
      category_id: getParam("category_id"),
      price_from: getParam("price_from"),
      price_to: getParam("price_to"),
      country_id,
      user_id: userId,
      longitude,
      latitude,
      kilometers,
      delivery_method,
    }),
    [
      getParam,
      country_id,
      userId,
      longitude,
      latitude,
      kilometers,
      delivery_method,
    ]
  );

  const query = useInfiniteQuery({
    queryKey: ["posts", filterBase],
    queryFn: ({ pageParam = 1 }) =>
      getClientFilteredPosts({ ...filterBase, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const posts = lastPage?.data ?? [];
      return posts.length === 0 ? undefined : lastPageParam + 1;
    },
  });

  return {
    ...query,
    posts: query.data?.pages.flatMap((page) => page.data ?? []) ?? [],
  };
}
