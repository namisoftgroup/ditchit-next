"use client";

import { useAuthStore } from "@/features/auth/store";
import { logOutAction } from "@/features/auth/actions";
import { UserPen, Heart, UserRound, LogOut, Megaphone } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function UserMenu() {
  const router = useRouter();
  const { user ,isAuthenticated, logout } = useAuthStore((state) => state);
  const t = useTranslations("header");

  const performLogout = async () => {
    const res = await logOutAction();
    if (res.code === 200) {
      logout();
      router.push("/");
    }
  };

  return isAuthenticated ? (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-[40px] h-[40px] rounded-full overflow-hidden border border-[var(--lightBorderColor)]">
        <Image src={user?.image || "" } alt={user?.name || "user image"} width={40} height={40} className="object-cover rounded-full w-[40px] h-[40px]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[var(--whiteColor)] shadow-[0_2px_8px_rgba(0,0,0,0.1)] z-[99999] min-w-[200px] flex-col rounded border border-[var(--lightBorderColor)] max-h-[400px] overflow-y-auto">
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex items-center gap-2 whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm rtl:flex-row-reverse"
          >
            <Megaphone width={20} height={20} />
            {t("my_posts")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/profile/my-favorites"
            className="flex items-center gap-2 whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm rtl:flex-row-reverse"
          >
            <Heart width={20} height={20} />
            {t("favorites")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/profile/edit-profile"
            className="flex items-center gap-2 whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm rtl:flex-row-reverse"
          >
            <UserPen width={20} height={20} />
            {t("edit_profile")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <button
            className="flex items-center w-full gap-2 whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm rtl:flex-row-reverse"
            onClick={performLogout}
          >
            <LogOut width={20} height={20} />
            {t("logout")}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link
      href="/login"
      className="text-[var(--mainColor)] border-0 flex items-center justify-center gap-2 p-2 bg-[var(--mainColor10)] h-[40px] min-w-[40px] rounded-full transition-all relative"
    >
      <UserRound width={20} height={20} />
    </Link>
  );
}
