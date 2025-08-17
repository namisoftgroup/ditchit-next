import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      autoConnect: false,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("[SOCKET] ✅ Connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("[SOCKET] ❌ Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("[SOCKET] ⚠️ Connection Error:", err.message);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error("Socket not initialized. Call initSocket()");
  return socket;
};
