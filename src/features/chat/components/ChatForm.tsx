"use client";

import { useState } from "react";

import { Message, MessagePayload } from "../types";
import { useAuthStore } from "@/features/auth/store";
import {
  CircleQuestionMark,
  HandCoins,
  MapPinPlus,
  Mic,
  Paperclip,
  Send,
} from "lucide-react";
import useSendMessage from "../useSendMessage";

export default function ChatForm({ roomId }: { roomId: number }) {
  const { user } = useAuthStore();
  const { sendMessageMutation, isPending } = useSendMessage();

  const [message, setMessage] = useState<Message>({
    sender_id: user?.id || 0,
    room_id: roomId,
    msg_type: "text",
    date: "",
    time: "",
    duration: "",
    timestamp: 0,
    latitude: 0,
    longitude: 0,
    file: "",
    ext: null,
    type: "",
    name: "",
    size: "",
    message: "",
  });

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.msg_type || !message.room_id) return;

    const formData: MessagePayload = {
      type: message.msg_type,
      room_id: message.room_id,
      message: message.message || "",
    };

    switch (message.msg_type) {
      case "text":
        if (!message.message?.trim()) return;
        formData.message = message.message;
        break;

      case "location":
        if (!message.latitude || !message.longitude) return;
        formData.latitude = message.latitude;
        formData.longitude = message.longitude;
        break;

      case "files":
        if (!message.file) return;
        formData.files = [message.file as unknown as File];
        break;

      default:
        return;
    }

    sendMessageMutation(formData, {
      onSuccess() {
        setMessage((prev) => ({
          ...prev,
          message: "",
          file: "",
          latitude: 0,
          longitude: 0,
        }));
      },
    });
  };

  return (
    <div className="w-full flex flex-col gap-2 p-2">
      <div className="flex bg-white rounded-[12px] p-2 text-center relative gap-2">
        <button className="text-[14px] flex-1 flex items-center justify-center gap-2 p-2 border-none">
          <CircleQuestionMark width={18} height={18} />
          Questions
        </button>

        <span className="block w-px h-full bg-[var(--lightBorderColor)]" />

        <button className="text-[14px] flex-1 flex items-center justify-center gap-2 p-2 border-none">
          <HandCoins width={18} height={18} />
          Make Offer
        </button>
      </div>

      <form className="flex gap-2" onSubmit={handleSendMessage}>
        <div className="bg-white p-2 w-full rounded-[12px] flex gap-1 items-center">
          <input
            className="w-full h-full p-1 placeholder:text-[14px] placeholder:text-[#777] outline-none"
            type="text"
            id="text-message"
            name="text-message"
            placeholder="write here..."
            autoComplete="off"
            value={message.message || ""}
            onChange={(e) =>
              setMessage((prev) => ({
                ...prev,
                msg_type: "text",
                message: e.target.value,
              }))
            }
          />

          <label className="p-1 cursor-pointer" htmlFor="file">
            <input type="file" name="file" id="file" className="hidden" />
            <Paperclip />
          </label>

          <span className="p-1 cursor-pointer">
            <MapPinPlus />
          </span>

          <span className="p-1 cursor-pointer">
            <Mic />
          </span>
        </div>

        <button
          className="p-4 rounded-[12px] bg-[var(--mainColor)] text-white relative"
          type="submit"
          disabled={isPending}
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}
