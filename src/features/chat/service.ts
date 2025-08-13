import serverAxios from "@/lib/axios/serverAxios";

type getRoomsResponse = {
  data: [];
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
