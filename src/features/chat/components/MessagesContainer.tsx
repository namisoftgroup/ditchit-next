"use client";

import { useEffect, useMemo, useRef } from "react";
import { useChatStore } from "../store";
import { Message } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { SOCKET_EVENTS } from "@/utils/constants";
import { initSocket } from "@/lib/socket/socket";
import MessageUI from "./MessageUI";

export default function MessagesContainer({
  initialMessages,
  otherUserId,
  roomId,
}: {
  initialMessages: Message[];
  otherUserId: number;
  roomId: number;
}) {
  const { messagesByRoom, setMessages, rooms, updateRoom } = useChatStore();
  const queryClient = useQueryClient();

  const messages = useMemo(
    () => messagesByRoom[roomId] || [],
    [messagesByRoom, roomId]
  );

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages(roomId, initialMessages);
  }, [roomId, setMessages, initialMessages]);

  useEffect(() => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    if (room.count_not_read > 0) {
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      updateRoom(room.id, { ...room, count_not_read: 0 });
    }
  }, [rooms, roomId, updateRoom, queryClient]);

  useEffect(() => {
    if (!roomId) return;

    const socket = initSocket();
    if (!socket.connected) socket.connect();

    socket.emit(SOCKET_EVENTS.JOIN_ROOMS, JSON.stringify([roomId]));

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_ROOMS, JSON.stringify([roomId]));
    };
  }, [roomId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="h-full p-4 flex flex-col gap-3 max-h-[420px] overflow-y-auto"
      ref={chatContainerRef}
    >
      {messages.map((message) => (
        <MessageUI
          key={message.timestamp}
          message={message}
          otherUserId={otherUserId}
        />
      ))}
    </div>
  );
}
