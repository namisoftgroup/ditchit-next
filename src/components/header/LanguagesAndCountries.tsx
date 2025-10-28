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
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [langCode, countryCode] = locale.split("-");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetCountries(langCode);

  const fetchedCountries = data?.pages.flatMap((p) => p.data.data) ?? [];
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(fetchedCountries);
  
  const searchCache = useRef<Record<string, { countries: Country[]; timestamp: number }>>({});
  const isSearchingRef = useRef<boolean>(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search handler
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If empty query, show all countries
    if (!query.trim()) {
      setFilteredCountries(fetchedCountries);
      return;
    }

    // Check cache first
    const cacheKey = `search_${query.trim().toLowerCase()}`;
    if (searchCache.current[cacheKey]) {
      const cachedResult = searchCache.current[cacheKey];
      // Only use cache if it's recent (less than 1 hour old)
      if (Date.now() - cachedResult.timestamp < 3600000) {
        setFilteredCountries(cachedResult.countries);
        return;
      }
    }

    // Skip if we're already searching
    if (isSearchingRef.current) {
      return;
    }

    isSearchingRef.current = true;

    // Debounce the search
    searchTimeoutRef.current = setTimeout(() => {
      // Filter countries
      const filtered = fetchedCountries.filter(country => 
        country.title.toLowerCase().includes(query.toLowerCase()) ||
        country.code.toLowerCase().includes(query.toLowerCase())
      );

      // Update state with filtered results
      setFilteredCountries(filtered);

      // Cache the result
      searchCache.current[cacheKey] = {
        countries: filtered,
        timestamp: Date.now(),
      };

      isSearchingRef.current = false;
    }, 300);
  }, [fetchedCountries]);

  const allCountries = data?.pages.flatMap((p) => p.data.data) ?? [];
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Setup IntersectionObserver بعد ما الـ dropdown يفتح
  useEffect(() => {
    // لو الـ dropdown مش مفتوح، نوقف الـ observer
    if (!isOpen) {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    // ننتظر شوية عشان الـ DOM يتحدث بعد فتح الـ dropdown
    const timer = setTimeout(() => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      // ننظف الـ observer القديم لو موجود
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // ننشئ observer جديد
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const target = entries[0];
          
          // لو العنصر ظاهر وفيه صفحة تانية ومش بنحمل دلوقتي
          if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        {
          root: scrollContainer, // الـ scrollable container
          rootMargin: "50px", // نبدأ التحميل قبل الوصول للنهاية بـ 50px
          threshold: 0, // نشتغل بمجرد ما جزء صغير من العنصر يظهر
        }
      );

      // نلاقي الـ sentinel element ونبدأ نراقبه
      const sentinel = scrollContainer.querySelector("[data-sentinel]");
      if (sentinel) {
        observerRef.current.observe(sentinel);
        // console.log("Observer attached to sentinel");
      }
    }, 100); // delay صغير عشان الـ DOM يكون جاهز

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [
    isOpen,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    allCountries.length,
  ]);

  function changeCountry(newCountryCode: string) {
    if (!locale) return pathname;
    return `/${langCode}-${newCountryCode}${pathname}${queryString ? `?${queryString}` : ""}`;
  }

  function changeLang(newLang: string) {
    if (!locale) return pathname;
    return `/${newLang}-${countryCode}${pathname}${queryString ? `?${queryString}` : ""}`;
  }

  function revalidateQueries() {
    queryClient.clear();
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
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

          <div
            ref={scrollContainerRef}
            className="max-h-[360px] w-[200px] overflow-y-auto overflow-x-hidden flex-col"
          >
            {isLoading ? (
              // Loading state للتحميل الأولي
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
                        document.cookie = `countryId=${country.id}; path=/`;
                        revalidateQueries();
                        setIsOpen(false); // نقفل الـ dropdown بعد الاختيار
                      }}
                      className="flex items-center gap-2 whitespace-nowrap 
                      text-[var(--darkColor)] hover:bg-[#f1f1f1] px-3 py-2 text-[14px] w-full rounded-[8px]"
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

                {/* Loading skeleton للصفحات التالية */}
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

                {/* Sentinel element - العنصر اللي هنراقبه */}
                {hasNextPage && (
                  <div
                    data-sentinel
                    className="h-4 w-full"
                    style={{ minHeight: "1px" }}
                  />
                )}

                {/* رسالة لما نخلص كل الدول */}
                {!hasNextPage && allCountries.length > 0 && (
                  <div className="px-3 py-2 text-center text-xs text-gray-500">
                    {/* يمكن تضيف رسالة هنا لو عايز */}
                  </div>
                )}
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
                    setIsOpen(false); // نقفل الـ dropdown بعد الاختيار
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
