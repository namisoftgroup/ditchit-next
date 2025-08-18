
import { getSocket } from "./socket";
import { SOCKET_EVENTS } from "@/utils/constants";
import { useChatStore } from "@/features/chat/store";
import { SocketMessage } from "@/features/chat/types";

export const sendFirstMessage = (payload: SocketMessage) => {
  const socket = getSocket();
  socket.emit(SOCKET_EVENTS.SEND_FIRST_MESSAGE, payload);

  useChatStore.getState().addMessage(payload.room.id, payload.messages[0]);
};

export const sendMessage = (payload: SocketMessage) => {
  const socket = getSocket();
  socket.emit(SOCKET_EVENTS.SEND_MESSAGE, payload);

  useChatStore.getState().addMessage(payload.room.id, payload.messages[0]);
};
