import { getRoomResponse, getRoomsResponse } from "./types";
import serverAxios from "@/lib/axios/serverAxios";

export async function getChatRooms(page: number): Promise<getRoomsResponse> {
  try {
    const res = await serverAxios.get("/chat", {
      params: {
        page,
      },
    });

    return res.data as getRoomsResponse;
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    throw new Error("Failed to fetch chat rooms");
  }
}

export async function getChatRoomsClient(page: number): Promise<getRoomsResponse> {
  try {
    const res = await serverAxios.get("/chat", {
      params: {
        page,
      },
    });

    return res.data as getRoomsResponse;
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    throw new Error("Failed to fetch chat rooms");
  }
}

export async function getRoom(id: string): Promise<getRoomResponse> {
  try {
    const res = await serverAxios.get(`/chat/${id}`);

    return res.data;
  } catch (error) {
    console.error("Error fetching chat room:", error);
    throw new Error("Failed to fetch chat room");
  }
}
