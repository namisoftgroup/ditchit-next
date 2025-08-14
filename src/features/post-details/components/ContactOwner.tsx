"use client";

import { MessagesSquare, PhoneCall } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { User } from "@/types/user";
import Link from "next/link";

export default function ContactOwner({
  owner,
  postId,
}: {
  owner: User;
  postId: number;
}) {
  const { user } = useAuthStore();
  return (
    <>
      {owner.id !== user?.id && (
        <div className="flex items-center gap-2 p-2">
          <Link
            href={`/chats?post_id=${postId}`}
            className="flex-1 px-4 py-3 rounded-[16px] flex items-center justify-center gap-2 bg-[var(--mainColor)] text-[var(--whiteColor)] capitalize text-[16px]"
          >
            <MessagesSquare />
            <span> chat </span>
          </Link>
          <Link
            href={`tel:${owner.phone}`}
            className="flex-1 px-4 py-3 rounded-[16px] flex items-center justify-center gap-2 bg-[#2562d3] text-[var(--whiteColor)] capitalize text-[16px]"
          >
            <PhoneCall />
            <span> call </span>
          </Link>
        </div>
      )}
    </>
  );
}
