"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getRoomsResponse } from "./types";
import serverAxios from "@/lib/axios/serverAxios";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";

export async function deleteRoomAction(roomId: number) {
  await serverAxios.delete(`/chat/${roomId}`);
  revalidatePath("/chats");
}

// export async function getAllRoomsForSocket(): Promise<getRoomsResponse> {
//   if (!(await cookies()).get("token"))
//     return { data: [], message: "not authenticated", code: 401 };

//   try {
//     const res = await serverAxios.get("/chat");

//     return res.data as getRoomsResponse;
//   } catch (error) {
//     console.error("Error fetching chat rooms:", error);
//     throw new Error("Failed to fetch chat rooms");
//   }
// }

let cachedRooms: getRoomsResponse | null = null;
let lastFetchTime = 0;

export async function getAllRoomsForSocket(): Promise<getRoomsResponse> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { data: [], message: "not authenticated", code: 401 };

  const now = Date.now();
  if (cachedRooms && now - lastFetchTime < 30_000) {
    return cachedRooms;
  }

  try {
    const res = await serverAxios.get("/chat");
    cachedRooms = res.data;
    lastFetchTime = now;
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 401) {
      redirect("/api/auth/logout");
    }
    console.error("Error fetching chat rooms:", error);
    throw new Error("Failed to fetch chat rooms");
  }
}
