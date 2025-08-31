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
import { useLocale } from "next-intl";
import { playNotification } from "@/utils/notificationSound";
import NextLink from "next/link";
import Image from "next/image";

type ProviderProps = {
  rooms?: Room[];
  children: React.ReactNode;
};

export default function WebSocketProvider({
  rooms = [],
  children,
}: ProviderProps) {
  const { setRooms, addRoom, addMessage } = useChatStore();
  const { user } = useAuthStore();
  const params = useParams();
  const locale = useLocale();
  const currentRoomId = params?.roomId ? String(params.roomId) : null;

  const queryClient = useQueryClient();

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    const socket = initSocket();
    if (!socket.connected) socket.connect();

    console.log("[SOCKET] 🚀 Emitting user join:", userId);
    socket.emit(SOCKET_EVENTS.JOIN_USER, JSON.stringify(userId));

    if (rooms.length > 0) {
      setRooms(rooms);
      const roomIds = rooms.map((r) => r.id);
      console.log("[SOCKET] 🚪 Joining rooms:", roomIds);

      socket.emit(SOCKET_EVENTS.JOIN_ROOMS, JSON.stringify(roomIds));
    }

    socket.off(SOCKET_EVENTS.RECEIVE_FIRST_MESSAGE);
    socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE);

    socket.on(SOCKET_EVENTS.RECEIVE_FIRST_MESSAGE, (data: SocketMessage) => {
      console.log("[SOCKET] 📥 First message:", data);
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });

      addRoom(data.room);
      addMessage(data.room.id, data.messages[0]);

      if (currentRoomId !== String(data.room.id)) {
        playNotification();

        toast(
          <NextLink
            href={`/${locale}/chats/${data.room.id}`}
            className="flex gap-4 p-1 w-full"
          >
            <Image
              src={data.room.another_user.user.image}
              alt={data.room.another_user.user.name}
              className="w-[42px] h-[42px] rounded-full object-cover"
              width={42}
              height={42}
            />
            <div>
              <h6>{data.room.another_user.user.name}</h6>
              <p>{data.messages[0].message}</p>
            </div>
          </NextLink>
        );
      }
    });

    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (data: SocketMessage) => {
      console.log("[SOCKET] 📥 New message:", data);
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });

      useChatStore.setState((state) => {
        const targetRoom = state.rooms.find((r) => r.id === data.room.id);
        if (targetRoom) {
          return {
            rooms: state.rooms.map((r) =>
              r.id === data.room.id
                ? {
                    ...targetRoom,
                    latest_message: data.room.latest_message,
                    count_not_read: data.room.count_not_read,
                  }
                : r
            ),
          };
        }
        return {};
      });

      addMessage(data.room.id, data.messages[0]);

      if (currentRoomId !== String(data.room.id)) {
        playNotification();

        toast(
          <NextLink
            href={`/${locale}/chats/${data.room.id}`}
            className="flex gap-3 p-1 w-full"
          >
            <Image
              src={data.room.another_user.user.image}
              alt={data.room.another_user.user.name}
              className="w-[42px] h-[42px] rounded-full object-cover"
              width={42}
              height={42}
            />
            <div>
              <h6>{data.room.another_user.user.name}</h6>
              <p>{data.messages[0].message}</p>
            </div>
          </NextLink>
        );
      }
    });

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
    rooms,
    setRooms,
    addMessage,
    addRoom,
    user,
    locale,
    queryClient,
    currentRoomId,
  ]);

  return <>{children}</>;
}
