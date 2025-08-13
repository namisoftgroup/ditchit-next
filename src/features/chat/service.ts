import { Message, Room } from "./types";
import serverAxios from "@/lib/axios/serverAxios";

type getRoomsResponse = {
  data: [];
  message: string;
  code: number;
};

type getRoomResponse = {
  data: {
    room: Room;
    messages: Message[];
  };
  message: string;
  code: number;
};

export async function getChatRooms(): Promise<getRoomsResponse> {
  try {
    const res = await serverAxios.get("/chat");

    return res.data;
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
