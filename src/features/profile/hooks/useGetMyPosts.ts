"use client";

import { getMyPosts } from "@/features/profile/service";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";

export default function useGetMyPosts() {
  const { token } = useAuthStore();

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["my-posts"],
    queryFn: () => getMyPosts(),
    enabled: Boolean(token),
  });
  return { isLoading, data, error, refetch };
}
