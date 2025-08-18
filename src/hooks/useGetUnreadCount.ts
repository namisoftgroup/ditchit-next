"use client";

import clientAxios from "@/lib/axios/clientAxios";
import { useQuery } from "@tanstack/react-query";

export default function useGetUnreadCount() {
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
  });
  return { data };
}
