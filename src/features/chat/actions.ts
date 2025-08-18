"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getRoomsResponse } from "./types";
import serverAxios from "@/lib/axios/serverAxios";

export async function deleteRoomAction(roomId: number, currentRoomId?: number) {
  await serverAxios.delete(`/chat/${roomId}`);

  revalidatePath("/chats");

  if (currentRoomId && roomId === currentRoomId) {
    redirect("/chats");
  }
}

export async function getAllRoomsForSocket(): Promise<getRoomsResponse> {
  if (!(await cookies()).get("token"))
    return { data: [], message: "not authenticated", code: 401 };

  try {
    const res = await serverAxios.get("/chat");

    return res.data as getRoomsResponse;
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    throw new Error("Failed to fetch chat rooms");
  }
}
