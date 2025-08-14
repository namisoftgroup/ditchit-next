"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getChatRoomsClient } from "./service";

export default function useGetChatRooms() {
  const { data, isLoading, hasNextPage, isFetchingNextPage , refetch, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["chat-rooms"],
      queryFn: ({ pageParam = 1 }) => getChatRoomsClient(pageParam),
      initialPageParam: 1,

      getNextPageParam: (lastPage, _, lastPageParam) => {
        const posts = lastPage?.data ?? [];
        if (posts.length === 0) return undefined;
        return lastPageParam + 1;
      },
    });

  return {
    rooms: data?.pages.flatMap((page) => page.data ?? [])  ?? [],
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
  };
}
