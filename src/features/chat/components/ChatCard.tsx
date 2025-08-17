"use client";

import { useState } from "react";
import { Room } from "../types";
import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  EllipsisVertical,
  Images,
  MapPin,
  Mic,
  Trash,
  Video,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import ConfirmModal from "@/components/modals/ConfirmModal";
import useDeleteRoom from "../useDeleteRoom";

export default function ChatCard({ room }: { room: Room }) {
  const params = useParams();
  const currentRoomId = params?.roomId;
  const active = currentRoomId === String(room.id);

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const { deleteRoom, isPending } = useDeleteRoom(setShowConfirm);

  return (
    <Link
      href={`/chats/${room.id}`}
      className={clsx(
        "flex items-center gap-2 p-1 px-2 rounded-xl flex-wrap text-start border bg-[var(--whiteColor)] transition",
        active
          ? "border-white !bg-[#00a6501a]"
          : "border-white hover:border-[var(--lightBorderColor)]"
      )}
    >
      <div className="flex gap-2 w-full">
        <Image
          src={room.another_user.user.image}
          width={64}
          height={64}
          alt={room.another_user.user.name}
        />

        <div className="flex flex-col gap-[2px] flex-1 items-start p-2">
          <h6 className="font-bold capitalize text-[12px]">
            {room.another_user.user.name}
          </h6>

          <p className="text-[12px] text-[var(--mainColor)] line-clamp-1">
            {room.latest_message.message}
            {room.latest_message.type === "location" && (
              <div className="flex items-center gap-1">
                <MapPin width={14} height={14} />
                Shared Location
              </div>
            )}

            {room.latest_message.type === "files" && (
              <>
                {room.latest_message.files[0].type === "audio" && (
                  <div className="flex items-center gap-1">
                    <Mic width={14} height={14} />
                    Audio
                  </div>
                )}

                {room.latest_message.files[0].type === "image" && (
                  <div className="flex items-center gap-1">
                    <Images width={14} height={14} />
                    Photo
                  </div>
                )}

                {room.latest_message.files[0].type === "video" && (
                  <div className="flex items-center gap-1">
                    <Video width={14} height={14} />
                    Video
                  </div>
                )}
              </>
            )}
          </p>

          <span className="text-[10px]">{room.latest_message.time}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="h-7 w-7 mt-2 rounded-full flex items-center justify-center bg-white border border-[var(--lightBorderColor)] ">
            <EllipsisVertical width={16} height={16} />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-[var(--whiteColor)] shadow-[0_2px_8px_rgba(0,0,0,0.1)] z-[99999] min-w-[100px] flex-col rounded border border-[var(--lightBorderColor)] max-h-[400px] overflow-y-auto">
            <DropdownMenuItem asChild>
              <button
                className="flex items-center gap-2 w-full whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(true);
                }}
              >
                <Trash width={16} height={16} className="text-[#FF0000]" />
                Delete
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        className={clsx(
          "w-full  p-2 pl-4 mb-1 rounded-full",
          active ? "bg-[#00a6501a]" : "bg-[rgba(228,228,228,0.4)]"
        )}
      >
        <span className="text-[12px]">{room.post.title}</span>
      </div>

      <ConfirmModal
        modalTitle="Delete Chat"
        text="Are you sure you want to delete this chat room?"
        show={showConfirm}
        isPending={isPending}
        event={() =>
          deleteRoom({ roomId: room.id, currentRoomId: Number(currentRoomId) })
        }
        handleClose={() => setShowConfirm(false)}
      />
    </Link>
  );
}
