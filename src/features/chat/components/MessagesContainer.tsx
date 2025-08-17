"use client";

import { useEffect, useMemo, useRef } from "react";
import { useChatStore } from "../store";
import { Message } from "../types";
import { getSocket, initSocket } from "@/lib/socket/socket";
import { SOCKET_EVENTS } from "@/utils/constants";
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
  const { messagesByRoom, setMessages, addMessage } = useChatStore();
  const messages = useMemo(
    () => messagesByRoom[roomId] || [],
    [messagesByRoom, roomId]
  );

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages(roomId, initialMessages);

    initSocket();
    const socket = getSocket();

    try {
      console.log("[ROOM] 🚪 Joining room:", roomId);
      socket.emit(SOCKET_EVENTS.JOIN_ROOMS, JSON.stringify([roomId]));

      const handleNewMessage = (message: Message) => {
        if (message.room_id === roomId) {
          addMessage(roomId, message);
        }
      };

      socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);

      return () => {
        console.log("[ROOM] 🚪 Leaving room:", roomId);
        socket.emit(SOCKET_EVENTS.LEAVE_ROOMS, JSON.stringify([roomId]));
        socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);
      };
    } catch (error) {
      console.error("Socket error:", error);
    }
  }, [roomId, setMessages, addMessage, initialMessages]);

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
