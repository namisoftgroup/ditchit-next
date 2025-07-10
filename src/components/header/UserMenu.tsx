"use client";

import { useAuthStore } from "@/features/auth/store";
import { UserRound } from "lucide-react";
import Link from "next/link";

export default function UserMenu() {
  const { user, token } = useAuthStore((state) => state);
  console.log(user, token);

  return (
    <Link
      href="/login"
      className="text-[var(--mainColor)] border-0 flex items-center justify-center gap-2 p-2 bg-[var(--mainColor10)] h-[40px] min-w-[40px] rounded-full transition-all relative"
    >
      <UserRound width={20} height={20} />
    </Link>
  );
}
