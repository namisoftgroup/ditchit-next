import { getSocket, initSocket } from "./socket";
import { SOCKET_EVENTS } from "@/utils/constants";
import { useChatStore } from "@/features/chat/store";
import { SocketMessage } from "@/features/chat/types";

function ensureSocket() {
  let socket;
  try {
    socket = getSocket();
  } catch {
    socket = initSocket();
    socket.connect();
  }
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

export const sendFirstMessageSocket = (payload: SocketMessage) => {
  const socket = ensureSocket();
  console.log("[SOCKET] 🚀 Sending first message:", payload);

  socket.emit(SOCKET_EVENTS.SEND_FIRST_MESSAGE, payload);
  socket.emit(SOCKET_EVENTS.JOIN_ROOMS, JSON.stringify([payload.room.id]));

  useChatStore.getState().addMessage(payload.room.id, payload.messages[0]);
};

export const sendMessageSocket = (payload: SocketMessage) => {
  const socket = ensureSocket();
  console.log("[SOCKET] 🚀 Sending message:", payload);

  socket.emit(SOCKET_EVENTS.SEND_MESSAGE, payload);

  useChatStore.getState().addMessage(payload.room.id, payload.messages[0]);
};
