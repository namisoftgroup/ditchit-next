"use client";

import { useEffect, useRef } from "react";
import { Category, HomeFilterInterface } from "../types";
import CategorySlider from "./CategorySlider";
import CategorySliderSkeleton from "./CategorySliderSkeleton";
import useGetCategoriesWithPosts from "@/features/home/useGetCategoriesWithPosts";
import NoDataPlaceHolder from "@/components/shared/NoDataPlaceHolder";
import { useTranslations } from "next-intl";

export default function CategoriesList({
  filterParams,
}: {
  filterParams: HomeFilterInterface;
}) {
  const t = useTranslations("common");

  const { categories, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetCategoriesWithPosts(filterParams);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 1.0,
      }
    );

    observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allEmpty =
    categories.length > 0 &&
    categories.every((category: Category) => category.posts.length === 0);

  return (
    <div className="space-y-12">
      {allEmpty ? (
        <div className="w-full flex flex-col justify-center items-center py-16">
          <NoDataPlaceHolder />
          <h4 className="font-bold text-[#000] text-[18px] mb-2">{t("no_available")}</h4>
          <p className="text-sm text-gray-600">{t("no_available_text")}</p>
        </div>
      ) : (
        categories.map(
          (category: Category) =>
            category.posts.length !== 0 && (
              <CategorySlider
                key={category.value}
                category={category}
                filterParams={filterParams}
              />
            )
        )
      )}

      {isFetchingNextPage && <CategorySliderSkeleton />}

      {!allEmpty && <div ref={bottomRef} />}
    </div>
  );
}
