import { getCountries } from "@/services/getCountries";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useGetCountries(lang: string) {
  return useInfiniteQuery({
    queryKey: ["countries", lang],
    queryFn: ({ pageParam = 1 }) => getCountries(lang, pageParam, 15),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage?.data?.data || lastPage.data.data.length < 15) return undefined;
      if (!lastPage.data.next_page_url) return undefined;
      return lastPageParam + 1;
    },
  });
}
