"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LANGUAGES } from "@/utils/constants";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Country } from "@/types/country";
import Link from "next/link";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user";
import { useState } from "react";

export default function LanguagesAndCountries({
  countries,
  profileData,
}: {
  countries: Country[];
  profileData: User | null;
}) {
  const pathname = usePathname();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const queryClient = useQueryClient();
  const t = useTranslations("common");

  const [langCode, countryCode] = locale.split("-");

  // Pagination state for countries list
  const [countryPage, setCountryPage] = useState(0);
  const pageSize = 10;
  const totalCountryPages = Math.ceil(countries.length / pageSize);
  const paginatedCountries = countries.slice(
    countryPage * pageSize,
    countryPage * pageSize + pageSize
  );

  function changeLang(newLang: string) {
    if (!locale) return pathname;
    return `/${newLang}-${countryCode}${pathname}${queryString ? `?${queryString}` : ""}`;
  }

  function changeCountry(newCountryCode: string) {
    if (!locale) return pathname;
    return `/${langCode}-${newCountryCode}${pathname}${queryString ? `?${queryString}` : ""}`;
  }

  function revalidateQueries() {
    queryClient.clear();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 whitespace-nowrap ">
        <Image
          src={
            countries.find((c) => c.code === countryCode)?.flag ??
            profileData?.country?.flag ??
            countries.find((c) => c.code === "US")?.flag ??
            "/placeholder-flag.png"
          }
          width={24}
          height={16}
          alt="current country"
          className="w-[24px] h-[18px] object-cover rounded"
        />
        <span>|</span>
        {langCode.toUpperCase()}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-[var(--whiteColor)] shadow-[0_2px_8px_rgba(0,0,0,0.1)] z-[99999] min-w-[200px] flex gap-2 border border-[var(--lightBorderColor)]">
        {/* === Countries List === */}
        <div>
          <h6 className="px-[16px] py-[8px] text-[var(--mainColor)]">
            {t("country")}
          </h6>

          <div className="max-h-[360px] w-[200px] overflow-y-auto flex-col">
            {paginatedCountries.map((country) => (
              <DropdownMenuItem key={country.id} className="p-0">
                <Link
                  href={changeCountry(country.code)}
                  onClick={() => {
                    document.cookie = `countryId=${country.id}; path=/`;
                    revalidateQueries();
                  }}
                  className="flex items-center gap-2 whitespace-nowrap text-[var(--darkColor)] hover:bg-[#f1f1f1] px-3 py-2 text-[14px] w-full rounded-[8px]"
                >
                  <Image
                    src={country.flag}
                    width={24}
                    height={18}
                    alt={country.title}
                    className="w-[24px] h-[18px] object-cover rounded"
                  />
                  {country.title}
                </Link>
              </DropdownMenuItem>
            ))}

            {/* Pagination controls */}
            {totalCountryPages > 1 && (
              <div className="flex justify-between items-center px-3 py-2 text-sm  ">
                <button
                  className="px-2 py-1 disabled:opacity-40"
                  disabled={countryPage === 0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCountryPage((p) => Math.max(0, p - 1));
                  }}
                >
                  ‹
                </button>
                <span>
                  {countryPage + 1} / {totalCountryPages}
                </span>
                <button
                  className="px-2 py-1 disabled:opacity-40"
                  disabled={countryPage === totalCountryPages - 1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCountryPage((p) =>
                      Math.min(totalCountryPages - 1, p + 1)
                    );
                  }}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <span className="block w-[1px] h-[400px] bg-[var(--lightBorderColor)]" />

        {/* === Languages List === */}
        <div>
          <h6 className="px-[16px] py-[8px] text-[var(--mainColor)]">
            {t("language")}
          </h6>

          <div className="max-h-[360px] overflow-y-auto flex-col">
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <DropdownMenuItem key={code} className="p-0">
                <Link
                  href={changeLang(code)}
                  onClick={revalidateQueries}
                  className="flex items-center gap-2 whitespace-nowrap text-[var(--darkColor)] hover:bg-[#f1f1f1] px-3 py-2 text-[14px] w-full rounded-[8px]"
                >
                  {name}
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
