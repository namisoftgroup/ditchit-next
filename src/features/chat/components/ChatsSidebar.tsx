"use client";

import { useChatStore } from "../store";
import RoomLink from "./RoomLink";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";

export default function ChatsSidebar() {
  const { rooms } = useChatStore();
  const [search, setSearch] = useState<string>("");
  const t = useTranslations();

  const filteredRooms = useMemo(() => {
    if (!search.trim()) return rooms;
    const term = search.toLowerCase();
    return rooms.filter((room) =>
      room.another_user.user.name.toLowerCase().includes(term)
    );
  }, [search, rooms]);

  return (
    <div className="relative p-3 bg-[#fafafa] rounded-[14px] flex flex-col gap-2 flex-1 h-[673px] overflow-y-auto">
      {/* Search bar */}
      <Input
        type="text"
        placeholder={t("common.search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 px-3 mb-2 text-[14px] rounded-full border outline-none focus:border-[var(--mainColor)]"
      />

      {filteredRooms.map((room) => (
        <RoomLink room={room} key={room.id} />
      ))}
    </div>
  );
}
