"use client";

import { getMyFavorites } from "@/features/profile/service";
import { Post } from "@/types/post";
import { useQuery } from "@tanstack/react-query";

export default function useGetMyFavorites() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["my-favorites"],
    queryFn: () => getMyFavorites(),
  });
  return { isLoading, posts: data?.data as Post[] ?? [], error };
}
