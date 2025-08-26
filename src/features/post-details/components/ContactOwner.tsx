"use client";

import { MessagesSquare, PhoneCall } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { User } from "@/types/user";
import Link from "next/link";
import useGenerateRoom from "../useGenerateRoom";

export default function ContactOwner({
  owner,
  postId,
}: {
  owner: User;
  postId: number;
}) {
  const { user } = useAuthStore();
  const { generateRoom, isPending } = useGenerateRoom();

  return (
    <>
      {owner.id !== user?.id && (
        <div className="flex items-center gap-2 p-2">
          <button
            className="flex-1 px-4 py-3 rounded-[16px] flex items-center justify-center gap-2 bg-[var(--mainColor)] text-[var(--whiteColor)] capitalize text-[16px]"
            onClick={() => generateRoom(postId)}
            disabled={isPending}
          >
            {isPending ? (
              "loading..."
            ) : (
              <>
                <MessagesSquare />
                <span> chat </span>
              </>
            )}
          </button>
          {owner.phone && (
            <Link
              href={`tel:${owner.phone}`}
              className="flex-1 px-4 py-3 rounded-[16px] flex items-center justify-center gap-2 bg-[#2562d3] text-[var(--whiteColor)] capitalize text-[16px]"
            >
              <PhoneCall />
              <span> call </span>
            </Link>
          )}
        </div>
      )}
    </>
  );
}
