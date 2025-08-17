"use client";

import { useEffect } from "react";
import { initSocket } from "@/lib/socket/socket";
import { useChatStore } from "../features/chat/store";
import { SOCKET_EVENTS } from "@/utils/constants";
import { useAuthStore } from "@/features/auth/store";

export default function WebSocketProvider({
  rooms = [],
  children,
}: {
  rooms?: Array<{ id: number }>;
  children: React.ReactNode;
}) {
  const { setRooms, addMessage } = useChatStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const userId = user?.id;

    if (!userId) return;

    const socket = initSocket();
    socket.connect();

    console.log("[SOCKET] 🚀 Emitting user join:", userId);
    socket.emit(SOCKET_EVENTS.JOIN_USER, userId);

    if (rooms.length) {
      const roomIds = rooms.map((r) => r.id);
      console.log("[SOCKET] 🚪 Joining rooms:", roomIds);
      socket.emit(SOCKET_EVENTS.JOIN_ROOMS, roomIds);
    }

    socket.on(SOCKET_EVENTS.RECEIVE_FIRST_MESSAGE, (data) => {
      console.log("[SOCKET] 📥 User-level data:", data);
      setRooms(data.rooms || []);
    });

    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (message) => {
      console.log("[SOCKET] 📥 New message:", message);
      if (message.room_id) {
        addMessage(message.room_id, message);
      }
    });

    return () => {
      console.log("[SOCKET] 🔌 Leaving user rooms");
      socket.emit(SOCKET_EVENTS.LEAVE_ROOMS, { userId });
      socket.disconnect();
    };
  }, [user, rooms, setRooms, addMessage]);

  return <>{children}</>;
}
