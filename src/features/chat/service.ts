import { getRoomResponse, getRoomsResponse, MessagePayload } from "./types";
import clientAxios from "@/lib/axios/clientAxios";
import serverAxios from "@/lib/axios/serverAxios";

export async function getChatRooms(): Promise<getRoomsResponse> {
  try {
    const res = await serverAxios.get("/chat");

    return res.data as getRoomsResponse;
  } catch (error) {
        // if((error as { response?: { status?: number } }).response?.status === 401) {
        //     redirect('/api/auth/logout');
        // }
    console.error("Error fetching chat rooms:", error);
    throw new Error("Failed to fetch chat rooms");
  }
}

export async function getChatRoomsClient(
  page: number
): Promise<getRoomsResponse> {
  try {
    const res = await clientAxios.get("/chat", {
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

export async function sendMessage(messagePayload: MessagePayload) {
  const res = await clientAxios.post("/chat", messagePayload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res;
}
