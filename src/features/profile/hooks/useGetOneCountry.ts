"use client";

import { useQuery } from "@tanstack/react-query";
import { getOneCountry } from "@/services/getOneCountry";
import { useLocale } from "next-intl";
import { getCookie } from "@/lib/utils";

export default function useGetOneCountry(countryIdParam?: string) {
  const locale = useLocale();
  // Prefer explicit param, fallback to cookie, fallback to default "us"
  const countryId = countryIdParam || (getCookie("countryId") as string) || "us";

  const query = useQuery({
    queryKey: ["one-country", countryId, locale],
    queryFn: () => getOneCountry(locale, countryId),
    enabled: !!countryId,
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });

  return query; 
}
