"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LANGUAGES } from "@/utils/constants";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LanguageMenu() {
  const pathname = usePathname();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  function buildLocalePath(newLang: string) {
    if (!locale) return pathname;

    const parts = locale.split("-");
    let updatedLocale: string;

    if (parts.length > 1) {
      updatedLocale = `${newLang}-${parts[parts.length - 1]}`;
    } else {
      updatedLocale = newLang;
    }

    return `/${updatedLocale}${pathname}${queryString ? `?${queryString}` : ""}`;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-[40px] h-[40px] flex items-center justify-center rounded-full border border-[var(--lightBorderColor)]">
        <Globe className="w-5 h-5 text-[var(--mainColor)]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[var(--whiteColor)] shadow-[0_2px_8px_rgba(0,0,0,0.1)] z-[99999] min-w-[200px] flex-col rounded border border-[var(--lightBorderColor)] max-h-[400px] overflow-y-auto">
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <DropdownMenuItem key={code} className="p-0">
            <Link
              href={buildLocalePath(code)}
              className="flex items-center gap-2 whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm w-full rounded-[8px]"
            >
              {name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
