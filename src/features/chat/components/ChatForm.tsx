"use client";

import { useState, useEffect } from "react";
import { MessagePayload } from "../types";
import { MapPinPlus, Paperclip, Send, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import useSendMessage from "../useSendMessage";
import Recorder from "./Recorder";
import ChooseLocationModal from "@/components/modals/ChooseLocationModal";
import QuestionAndOffers from "./QuestionAndOffers";

export default function ChatForm({
  roomId,
  questions,
}: {
  roomId: number;
  questions: { id: number; title: string }[];
}) {
  const [show, setShow] = useState(false);
  const [sound, setSound] = useState<File | null>(null);
  const [soundUrl, setSoundUrl] = useState<string | null>(null);
  const t = useTranslations("auth");

  const [message, setMessage] = useState<MessagePayload>({
    type: "text",
    message: "",
    room_id: roomId,
    files: undefined,
  });

  const { sendMessageMutation, isPending } = useSendMessage(setMessage);

  useEffect(() => {
    if (sound) {
      const url = URL.createObjectURL(sound);
      setSoundUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setSoundUrl(null);
    }
  }, [sound]);

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
    setSound(null);
  };

  return (
    <div className="w-full flex flex-col gap-2 p-2">
      <QuestionAndOffers questions={questions} roomId={roomId} />

      <form className="flex gap-2" onSubmit={handleSendMessage}>
        <div className="bg-white p-2 w-full rounded-[12px] flex gap-1 items-center">
          {soundUrl ? (
            <div className="flex items-center gap-2 w-full">
              <audio src={soundUrl} controls className="w-full" />
              <button
                type="button"
                onClick={() => setSound(null)}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-red-500 text-white"
              >
                <Trash size={16} />
              </button>
            </div>
          ) : (
            <input
              className="w-full h-full p-1 placeholder:text-[14px] placeholder:text-[#777] outline-none"
              type="text"
              id="text-message"
              name="text-message"
              placeholder={t("write_here")}
              autoComplete="off"
              value={message.message || ""}
              onChange={(e) =>
                setMessage((prev) => ({
                  ...prev,
                  type: "text",
                  message: e.target.value,
                }))
              }
            />
          )}

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

          <Recorder
            setMessage={setMessage}
            roomId={roomId}
            setSound={setSound}
          />
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
