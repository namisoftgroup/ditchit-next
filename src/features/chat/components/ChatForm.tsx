"use client";

import { useState } from "react";
import { MessagePayload } from "../types";

import {
  CircleQuestionMark,
  HandCoins,
  MapPinPlus,
  Paperclip,
  Send,
} from "lucide-react";
import useSendMessage from "../useSendMessage";
import Recorder from "./Recorder";
import ChooseLocationModal from "@/components/modals/ChooseLocationModal";

export default function ChatForm({ roomId }: { roomId: number }) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState<MessagePayload>({
    type: "text",
    message: "",
    room_id: roomId,
    files: undefined,
  });

  const { sendMessageMutation, isPending } = useSendMessage(setMessage);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData: MessagePayload = {
      type: message.type,
      room_id: message.room_id,
    };

    switch (message.type) {
      case "text":
        if (!message.message?.trim()) return;
        formData.message = message.message;
        break;

      case "files":
        if (!message.files) return;
        formData.files = message.files;
        break;

      default:
        return;
    }

    sendMessageMutation(formData);
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
            <input
              type="file"
              name="file"
              id="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={(e) => {
                e.preventDefault();
                const formData: MessagePayload = {
                  type: "files",
                  files: e.target.files ? [e.target.files[0]] : undefined,
                  room_id: message.room_id,
                };
                if (formData.files) sendMessageMutation(formData);
              }}
            />
            <Paperclip />
          </label>

          <span className="p-1 cursor-pointer" onClick={() => setShow(true)}>
            <MapPinPlus />
          </span>

          <Recorder setMessage={setMessage} roomId={roomId} />
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

      <ChooseLocationModal
        show={show}
        roomId={roomId}
        setMessage={setMessage}
        handleClose={() => setShow(false)}
      />
    </div>
  );
}
