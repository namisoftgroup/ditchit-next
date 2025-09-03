"use client";

import { useMemo } from "react";
import { Room } from "../types";
import { useChatStore } from "../store";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
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
  const t = useTranslations("chat");
  const roomId = useParams().roomId;

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
        <div className="flex flex-wrap  justify-center w-full">
          <div
            className={`md:p-2 w-full md:w-5/12 lg:w-4/12 xl:w-3/12 ${roomId ? "md:flex hidden" : ""}`}
          >
            <ChatsSidebar />
          </div>

          <div className="md:p-2 w-full md:w-7/12 lg:w-8/12 xl:w-9/12">
            {children}
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          <NoDataPlaceHolder />
          <p className="text-center text-gray-600 mt-4 md:max-w-md mb-7">
            {t("no_conversations_found")}
          </p>
        </div>
      )}
    </section>
  );
}
