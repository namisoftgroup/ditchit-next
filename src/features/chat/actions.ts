"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import serverAxios from "@/lib/axios/serverAxios";

export async function deleteRoomAction(roomId: number, currentRoomId?: number) {
  await serverAxios.delete(`/chat/${roomId}`);

  revalidatePath("/chats");

  if (currentRoomId && roomId === currentRoomId) {
    redirect("/chats");
  }
}
