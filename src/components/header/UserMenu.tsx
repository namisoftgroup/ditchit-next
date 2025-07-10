"use client";

import { useAuthStore } from "@/features/auth/store";
import { logOutAction } from "@/features/auth/actions";
import { UserPen, Heart, UserRound, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function UserMenu() {
  const { isAuthenticated, logout } = useAuthStore((state) => state);

  const performLogout = async () => {
    const res = await logOutAction();
    if (res.code === 200) {
      logout();
    }
  };

  return isAuthenticated ? (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-[var(--mainColor)] border-0 flex items-center justify-center gap-2 p-2 bg-[var(--mainColor10)] h-[40px] min-w-[40px] rounded-full transition-all relative">
        <UserRound width={20} height={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[var(--whiteColor)] shadow-[0_2px_8px_rgba(0,0,0,0.1)] z-[99999] min-w-[200px] flex-col rounded border border-[var(--lightBorderColor)] max-h-[400px] overflow-y-auto">
        <DropdownMenuItem asChild>
          <Link
            href="/my-posts"
            className="flex items-center gap-2 whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm"
          >
            <UserRound width={20} height={20} />
            My Posts
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/my-favourites"
            className="flex items-center gap-2 whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm"
          >
            <Heart width={20} height={20} />
            Favourites
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/edit-profile"
            className="flex items-center gap-2 whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm"
          >
            <UserPen width={20} height={20} />
            Edit Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <button
            className="flex items-center w-full gap-2 whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm"
            onClick={performLogout}
          >
            <LogOut width={20} height={20} />
            Logout
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
