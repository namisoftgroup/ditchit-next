"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import useGetUnreadCount from "@/hooks/useGetUnreadCount";

export default function Navigation({ isAuthed }: { isAuthed: boolean }) {
  const { data: count } = useGetUnreadCount();
  const t = useTranslations("common");

  return (
    <nav className="p-[6px] text-center md:block hidden">
      <ul className="flex-1">
        <div className="w-full flex items-center gap-2">
          <Link
            href="/"
            prefetch={true}
            className="flex flex-col items-center gap-2 text-[14px] text-[var(--darkColor)] font-bold capitalize p-2 relative whitespace-nowrap w-fit hover:text-[var(--mainColor)] [&.active]:text-[var(--mainColor)]"
          >
            {t("home")}
          </Link>

          <Link
            href="/posts"
            prefetch={true}
            className="flex flex-col items-center gap-2 text-[14px] text-[var(--darkColor)] font-bold capitalize p-2 relative whitespace-nowrap w-fit hover:text-[var(--mainColor)] [&.active]:text-[var(--mainColor)]"
          >
            {t("listing")}
          </Link>

          {isAuthed && (
            <Link
              href="/chats"
              className="flex flex-col text-[14px] items-center gap-2 text-[var(--darkColor)] font-bold capitalize p-2 relative whitespace-nowrap w-fit hover:text-[var(--mainColor)] [&.active]:text-[var(--mainColor)]"
            >
              {t("chats")}
              {count > 0 && (
                <div className="absolute top-0 end-[-6px]  max-lg:block bg-[var(--mainColor)] text-[var(--whiteColor)] text-[10px] font-bold px-1 rounded-full h-4 w-4 flex items-center justify-center">
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
