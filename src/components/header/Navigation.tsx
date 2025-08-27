"use client";

import { useAuthStore } from "@/features/auth/store";
import useGetUnreadCount from "@/hooks/useGetUnreadCount";
import { Link } from "@/i18n/navigation";

export default function Navigation() {
  const { token } = useAuthStore();
  const { data: count } = useGetUnreadCount();

  return (
    <nav className="p-[6px] pl-6 text-center md:block hidden">
      <ul className="flex-1">
        <div className="w-full flex items-center gap-2">
          <Link
            href="/"
            prefetch={true}
            className="flex flex-col items-center gap-2 text-[14px] text-[var(--darkColor)] font-bold capitalize px-4 py-2 relative whitespace-nowrap w-fit hover:text-[var(--mainColor)] [&.active]:text-[var(--mainColor)]"
          >
            Home
          </Link>

          <Link
            href="/posts"
            prefetch={true}
            className="flex flex-col items-center gap-2 text-[14px] text-[var(--darkColor)] font-bold capitalize px-4 py-2 relative whitespace-nowrap w-fit hover:text-[var(--mainColor)] [&.active]:text-[var(--mainColor)]"
          >
            Listing
          </Link>

          {token && (
            <Link
              href="/chats"
              className="flex flex-col text-[14px] items-center gap-2 text-[var(--darkColor)] font-bold capitalize px-4 py-2 relative whitespace-nowrap w-fit hover:text-[var(--mainColor)] [&.active]:text-[var(--mainColor)]"
            >
              Chats
              {count > 0 && (
                <div className="absolute top-0 right-0  max-lg:block bg-[var(--mainColor)] text-[var(--whiteColor)] text-[10px] font-bold px-1 rounded-full h-4 min-w-[16px] flex items-center justify-center">
                  {count}
                </div>
              )}
            </Link>
          )}
        </div>
      </ul>
    </nav>
  );
}
