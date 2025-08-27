"use client";

import { useAuthStore } from "@/features/auth/store";
import { useQuery } from "@tanstack/react-query";
import clientAxios from "@/lib/axios/clientAxios";

export default function useGetUnreadCount() {
  const { token } = useAuthStore();

  const { data } = useQuery({
    queryKey: ["unread-count"],
    queryFn: async () => {
      try {
        const res = await clientAxios.get("/profile/unReadMessagesCount");
        return res.data.data;
      } catch (error) {
        console.error("Error", error);
        throw new Error("Failed");
      }
    },
    enabled: !!token
  });
  return { data };
}
