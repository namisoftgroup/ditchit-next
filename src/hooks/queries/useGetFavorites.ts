"use client";

import { useAuthStore } from "@/features/auth/store";
import { getMyFavorites } from "@/features/profile/service";
import { useQuery } from "@tanstack/react-query";

export default function useGetMyFavorites() {
  const { token } = useAuthStore();
  
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["my-favorites"],
    queryFn: () => getMyFavorites(),
    enabled: Boolean(token),
  });
  return { isLoading, data, error, refetch };
}
