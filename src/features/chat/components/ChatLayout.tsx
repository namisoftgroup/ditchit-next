"use client";

import { useMemo } from "react";
import { Room } from "../types";
import { useChatStore } from "../store";
import NoDataPlaceHolder from "@/components/shared/NoDataPlaceHolder";
import ChatsSidebar from "./ChatsSidebar";

export default function ChatLayout({
  rooms,
  children,
}: {
  rooms: Room[];
  children: React.ReactNode;
}) {
  const { rooms: storeRooms } = useChatStore();

const allRooms = useMemo(
  () => [
    ...rooms,
    ...storeRooms.filter((r) => !rooms.some((apiR) => apiR.id === r.id)),
  ],
  [rooms, storeRooms]
);

  return (
    <section className="container py-6 flex gap-8">
      {allRooms.length > 0 ? (
        <div className="flex flex-wrap -mx-2 justify-center w-full">
          <div className="p-2 w-full md:w-5/12 lg:w-4/12 xl:w-3/12">
            <ChatsSidebar />
          </div>

          <div className="p-2 w-full md:w-7/12 lg:w-8/12 xl:w-9/12">
            {children}
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          <NoDataPlaceHolder />
          <p className="text-center text-gray-600 mt-4 md:max-w-md mb-7">
            No chat conversations found. Start a conversation from any post to
            see your chats appear here.
          </p>
        </div>
      ) }
    </section>
  );
}
