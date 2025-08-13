"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash } from "lucide-react";
import { Room } from "./types";
import Image from "next/image";
import Link from "next/link";

export default function ChatCard({ room }: { room: Room }) {
  return (
    <Link
      href={`/chats/${room.id}`}
      className="flex items-center gap-2 p-1 px-2 rounded-xl flex-wrap text-start border border-white bg-[var(--whiteColor)]"
    >
      <div className="flex gap-2 w-full">
        <Image
          src={room.another_user.user.image}
          width={64}
          height={64}
          alt={room.another_user.user.name}
        />

        <div className="flex flex-col gap-[2px] flex-1 items-start p-2">
          <h6 className="font-bold capitalize text-[14px]">
            {room.another_user.user.name}
          </h6>
          <p className="text-[12px] text-[var(--mainColor)]">
            {room.latest_message.message}
          </p>
          <span className="text-[10px]">{room.latest_message.time}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="h-7 w-7 mt-2 rounded-full flex items-center justify-center bg-white border border-[var(--lightBorderColor)] ">
            <EllipsisVertical width={16} height={16} />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-[var(--whiteColor)] shadow-[0_2px_8px_rgba(0,0,0,0.1)] z-[99999] min-w-[100px] flex-col rounded border border-[var(--lightBorderColor)] max-h-[400px] overflow-y-auto">
            <DropdownMenuItem asChild>
              <button className="flex items-center gap-2 w-full whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm">
                <Trash width={16} height={16} className="text-[#FF0000]" />
                Delete
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full bg-[rgba(228,228,228,0.4)] p-2 pl-4 mb-1 rounded-full">
        <span className="text-[12px]">
            {room.post.title}
        </span>
      </div>
    </Link>
  );
}
