"use client";
import { Room } from "../types";
import ChatCard from "./ChatCard";

export default function ChatsSidebar({ rooms }: { rooms: Room[] }) {
  return (
    <div className="p-3 bg-[#fafafa] rounded-[14px] flex flex-col gap-2 flex-1 h-[673px] overflow-y-auto">
      {rooms.map((room) => (
        <ChatCard room={room} key={room.id} />
      ))}
    </div>
  );
}
