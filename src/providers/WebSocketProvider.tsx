"use client";

import { useEffect } from "react";
import { initSocket } from "@/lib/socket/socket";
import { useChatStore } from "../features/chat/store";
import { SOCKET_EVENTS } from "@/utils/constants";
import { useAuthStore } from "@/features/auth/store";
import { Room, SocketMessage } from "./../features/chat/types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type ProviderProps = {
  rooms?: Room[];
  children: React.ReactNode;
};

export default function WebSocketProvider({
  rooms = [],
  children,
}: ProviderProps) {
  const { setRooms, addRoom, updateRoom, addMessage } = useChatStore();
  const { user } = useAuthStore();
  const params = useParams();
  const currentRoomId = params?.roomId;

  const queryClient = useQueryClient();

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    const socket = initSocket();
    if (!socket.connected) socket.connect();

    /*  Join user */
    console.log("[SOCKET] 🚀 Emitting user join:", userId);
    socket.emit(SOCKET_EVENTS.JOIN_USER, JSON.stringify(userId));

    /*  Join rooms */
    if (rooms.length > 0) {
      setRooms(rooms);
      const roomIds = rooms.map((r) => r.id);
      console.log("[SOCKET] 🚪 Joining rooms:", roomIds);

      socket.emit(SOCKET_EVENTS.JOIN_ROOMS, JSON.stringify(roomIds));
    }

    /* Listen to first message */
    socket.on(SOCKET_EVENTS.RECEIVE_FIRST_MESSAGE, (data: SocketMessage) => {
      console.log("[SOCKET] 📥 User-level data:", data);
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });

      addRoom(data.room);
      socket.emit(SOCKET_EVENTS.JOIN_ROOMS, JSON.stringify([data.room.id]));

      addMessage(data.room.id, data.messages[0]);
      toast(
        <Link href={`/chats/${data.room.id}`} className="flex gap-4 p-1 w-full">
          <Image
            src={data.room.another_user.user.image}
            alt={data.room.another_user.user.name}
            className="w-[42px] h-42px] rounded-full"
            width={42}
            height={42}
          />
          <div>
            <h6>{data.room.another_user.user.name}</h6>
            <p>{data.messages[0].message}</p>
          </div>
        </Link>
      );
    });

    /* Listen to normal messages */
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (data: SocketMessage) => {
      console.log("[SOCKET] 📥 New message:", data);
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });

      updateRoom(data.room);
      addMessage(data.room.id, data.messages[0]);

      if (currentRoomId !== String(data.room.id)) {
        toast(
          <Link href={`/chats/${data.room.id}`} className="flex gap-3 p-1 w-full">
            <Image
              src={data.room.another_user.user.image}
              alt={data.room.another_user.user.name}
              className="w-[42px] h-42px] rounded-full"
              width={42}
              height={42}
            />
            <div>
              <h6>{data.room.another_user.user.name}</h6>
              <p>{data.messages[0].message}</p>
            </div>
          </Link>
        );
      }
    });

    /* Debug any unexpected errors */
    socket.on("error", (err) => {
      console.error("[SOCKET] ❌ Server error:", err);
    });

    return () => {
      console.log("[SOCKET] 🔌 Leaving user rooms");
      socket.emit(
        SOCKET_EVENTS.LEAVE_ROOMS,
        JSON.stringify(rooms.map((r) => r.id))
      );
      socket.disconnect();
    };
  }, [
    user,
    rooms,
    setRooms,
    addMessage,
    addRoom,
    queryClient,
    updateRoom,
    currentRoomId,
  ]);

  return <>{children}</>;
}
