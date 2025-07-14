"use client";

import { getMyFavorites } from "@/features/profile/service";
import { useQuery } from "@tanstack/react-query";

export default function useGetMyFavorites() {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["my-favorites"],
    queryFn: () => getMyFavorites(),
  });
  return { isLoading, data, error, refetch };
}
