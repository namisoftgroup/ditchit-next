"use client";
import { useEffect, useRef } from "react";
import ChatCard from "./ChatCard";
import useGetChatRooms from "../useGetChatRooms";

export default function ChatsSidebar() {
  const sectionRef = useRef(null);

  const { rooms, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetChatRooms();

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const sectionBottom = (section as HTMLElement).getBoundingClientRect()
        .bottom;
      const viewportHeight = window.innerHeight;

      if (
        sectionBottom <= viewportHeight + 200 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage,fetchNextPage]);

  return (
    <div
      className="p-3 bg-[#fafafa] rounded-[14px] flex flex-col gap-2 flex-1 h-[673px] overflow-y-auto"
      ref={sectionRef}
    >
      {rooms.map((room) => (
        <ChatCard room={room} key={room.id} />
      ))}
    </div>
  );
}
