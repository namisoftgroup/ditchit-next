"use server";

import { revalidatePath } from "next/cache";
import serverAxios from "@/lib/axios/serverAxios";

export async function deleteRoomAction(room_id: number) {
  await serverAxios.delete(`/chat/${room_id}`);
  revalidatePath("/chats");
}
