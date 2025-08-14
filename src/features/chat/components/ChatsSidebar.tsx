"use client"
import ChatCard from "./ChatCard";
import useGetChatRooms from "../useGetChatRooms";

export default function ChatsSidebar() {
  const { rooms } = useGetChatRooms();

  console.log(rooms)

  return (
    <div className="p-3 bg-[#fafafa] rounded-[14px] flex flex-col gap-2 flex-1 h-[673px]">
      {rooms.map((room) => (
        <ChatCard room={room} key={room.id} />
      ))}
    </div>
  );
}
