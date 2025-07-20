"use client";

import { getMyPosts } from "@/features/profile/service";
import { useQuery } from "@tanstack/react-query";

export default function useGetMyPosts() {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["my-posts"],
    queryFn: () => getMyPosts(),
  });
  return { isLoading, data, error, refetch };
}
