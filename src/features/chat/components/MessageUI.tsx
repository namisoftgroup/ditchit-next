import { Message } from "../types";
import Image from "next/image";

export default function MessageUI({
  message,
  otherUserId,
}: {
  message: Message;
  otherUserId: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={`flex ${message.sender_id !== otherUserId ? "justify-end" : "justify-start"}`}
      >
        {message.msg_type === "text" && (
          <div
            className={`max-w-[80%] rounded-lg p-3 text-[14px] ${
              message.sender_id !== otherUserId
                ? "bg-[var(--mainColor)] text-white"
                : "bg-white"
            }`}
          >
            <span>{message.message}</span>
          </div>
        )}

        {(message.msg_type === "location" || message.msg_type === "files") && (
          <div className="max-w-[80%] rounded-lg overflow-hidden bg-[#f1f3f4] border-[2px] border-[#fff]">
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
              <iframe
                width="100%"
                height="200"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${message.latitude},${message.longitude}&z=14&output=embed`}
              />
            )}
          </div>
        )}
      </div>

      <span
        className={`text-[12px] text-[var(--grayColor)] px-1 flex ${message.sender_id !== otherUserId ? "justify-end" : "justify-start"}`}
      >
        {message.time}
      </span>
    </div>
  );
}
