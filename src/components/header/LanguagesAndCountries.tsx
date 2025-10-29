"use client";

import { parseLocaleCountry, buildLocaleCountryPath } from "@/i18n/routing";
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
import { useEffect, useRef, useState } from "react";
import useGetCountries from "@/hooks/useGetCountries";

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

  /** Helper: read cookie value safely on client */
  function getCookie(name: string): string | undefined {
    if (typeof document === "undefined") return undefined;
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : undefined;
  }

  const [langCode, rawCountry] = locale.split("-");
  const [countryCode, setCountryCode] = useState<string | undefined>(
    rawCountry
  );
  const [isOpen, setIsOpen] = useState(false);

  // Get countries with infinite scroll
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetCountries(langCode);

  const allCountries = data?.pages.flatMap((p) => p.data.data) ?? [];
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // When dropdown opens, attach observer for infinite scroll
  useEffect(() => {
    if (!isOpen) {
      observerRef.current?.disconnect();
      observerRef.current = null;
      return;
    }

    const timer = setTimeout(() => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      observerRef.current?.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const target = entries[0];
          if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { root: scrollContainer, rootMargin: "50px", threshold: 0 }
      );

      const sentinel = scrollContainer.querySelector("[data-sentinel]");
      if (sentinel) observerRef.current.observe(sentinel);
    }, 100);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [
    isOpen,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    allCountries.length,
  ]);

  /** ✅ Sync countryCode with cookie if not in locale */
  useEffect(() => {
    const cookieCountry = getCookie("country");
    if (!rawCountry && cookieCountry) {
      setCountryCode(cookieCountry);
    }
  }, [rawCountry]);

  // --- Helpers for link building ---
  function changeCountry(newCountryCode: string) {
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : pathname;
    const { restPath, locale } = parseLocaleCountry(currentPath);
    const cleanPath = restPath || "/";
    const url = buildLocaleCountryPath(
      locale || langCode,
      newCountryCode,
      cleanPath
    );
    return `${url}${queryString ? `?${queryString}` : ""}`;
  }

  function changeLang(newLang: string) {
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : pathname;
    const { restPath, country } = parseLocaleCountry(currentPath);
    const targetCountry = country || countryCode || "US";
    const cleanPath = restPath || "/";
    const url = buildLocaleCountryPath(newLang, targetCountry, cleanPath);
    return `${url}${queryString ? `?${queryString}` : ""}`;
  }

  function revalidateQueries() {
    queryClient.clear();
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="flex items-center gap-2 whitespace-nowrap">
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

          <div
            ref={scrollContainerRef}
            className="max-h-[360px] w-[200px] overflow-y-auto overflow-x-hidden flex-col"
          >
            {isLoading ? (
              <div className="flex flex-col gap-2 px-3 py-2">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-gray-200 animate-pulse rounded-md"
                  />
                ))}
              </div>
            ) : (
              <>
                {allCountries?.map((country) => (
                  <DropdownMenuItem key={country.id} className="p-0">
                    <Link
                      href={changeCountry(country.code)}
                      onClick={() => {
                        document.cookie = `country=${country.code}; path=/; max-age=${
                          60 * 60 * 24 * 365
                        }`;
                        document.cookie = `countryId=${country.id}; path=/; max-age=${
                          60 * 60 * 24 * 365
                        }`;
                        setCountryCode(country.code);
                        revalidateQueries();
                        setIsOpen(false);
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
                {isFetchingNextPage && (
                  <div className="flex flex-col gap-2 px-3 py-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-8 bg-gray-200 animate-pulse rounded-md"
                      />
                    ))}
                  </div>
                )}
                {hasNextPage && <div data-sentinel className="h-4 w-full" />}
              </>
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
                  onClick={() => {
                    revalidateQueries();
                    setIsOpen(false);
                  }}
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
