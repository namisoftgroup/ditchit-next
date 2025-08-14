"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "../types";
import Image from "next/image";

export default function MessagesContainer({
  messages,
  otherUserId,
}: {
  messages: Message[];
  otherUserId: number;
}) {
  const [messagesToMap, setMessagesToMap] = useState<Message[]>([]);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      (chatContainerRef.current as HTMLDivElement).scrollTop = (
        chatContainerRef.current as HTMLDivElement
      ).scrollHeight;
    }
  };

  useEffect(() => {
    setMessagesToMap([...messages].reverse());
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messagesToMap]);

  return (
    <div
      className="h-full p-4 flex flex-col gap-3 max-h-[420px] overflow-y-auto"
      ref={chatContainerRef}
    >
      {messagesToMap.map((message: Message) => (
        <div key={message.timestamp} className="flex flex-col gap-1">
          <div
            className={`flex ${message.sender_id === otherUserId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 text-[14px] ${
                message.sender_id === otherUserId
                  ? "bg-[var(--mainColor)] text-white"
                  : "bg-white"
              }`}
            >
              {message.msg_type === "text" && <span>{message.message}</span>}

              {message.msg_type === "files" && (
                <>
                  {message.type === "audio" && (
                    <audio src={message.file} controls />
                  )}

                  {message.type === "image" && (
                    <Image
                      src={message.file}
                      width={300}
                      height={200}
                      alt={message.file}
                    />
                  )}

                  {message.type === "video" && (
                    <video
                      src={message.file}
                      controls
                      style={{ width: "300px", height: "200px" }}
                    />
                  )}
                </>
              )}

              {message.msg_type === "location" && (
                <div className="w-full">
                  <iframe
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${message.latitude},${message.longitude}&z=14&output=embed`}
                  />
                </div>
              )}
            </div>
          </div>

          <span
            className={`text-[12px] text-[var(--grayColor)] px-1 flex ${message.sender_id === otherUserId ? "justify-end" : "justify-start"}`}
          >
            {message.time}
          </span>
        </div>
      ))}
    </div>
  );
}
