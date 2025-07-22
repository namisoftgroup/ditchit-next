"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AddPostMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="border-0 flex items-center justify-center gap-2 p-2 h-[40px] min-w-[40px] cursor-pointer rounded-full transition-all relative px-4 py-2 whitespace-nowrap bg-[var(--mainColor)] text-[var(--whiteColor)]">
          <CirclePlus width={20} height={20} />
          Add Post
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 space-y-2 p-2 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-[var(--lightBorderColor)]">
        <p className="p-2 text-sm text-gray-500">What do you want?</p>

        <div className="flex gap-1">
          <DropdownMenuItem asChild>
            <Link
              href="/create-post?postType=wanted"
              className="border border-[var(--lightBorderColor)] !rounded-[14px] aspect-square w-[calc(50%-2px)] flex flex-col justify-center items-center gap-2 text-[var(--darkColor)] px-4 py-2 text-[14px] capitalize"
            >
              <Image
                src="/icons/wanted.svg"
                alt="wanted"
                width={40}
                height={40}
              />
              <span>Wanted</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/create-post?postType=sale"
              className="border border-[var(--lightBorderColor)] !rounded-[14px] aspect-square w-[calc(50%-2px)] flex flex-col justify-center items-center gap-2 text-[var(--darkColor)] px-4 py-2 text-[14px] capitalize"
            >
              <Image src="/icons/sell.svg" alt="sell" width={40} height={40} />
              <span>Sell</span>
            </Link>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
