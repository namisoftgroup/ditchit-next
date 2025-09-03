"use client";

import { useEffect, useRef } from "react";
import { Category, HomeFilterInterface } from "../types";
import CategorySlider from "./CategorySlider";
import CategorySliderSkeleton from "./CategorySliderSkeleton";
import useGetCategoriesWithPosts from "@/features/home/useGetCategoriesWithPosts";

export default function CategoriesList({
  filterParams,
}: {
  filterParams: HomeFilterInterface;
}) {
  const {
    categories,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    lastPageSize,
  } = useGetCategoriesWithPosts(filterParams);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (
          entry.isIntersecting &&
          !isFetchingNextPage &&
          lastPageSize === 8
        ) {
          fetchNextPage();
        }
      },
      {
        root: null,
        threshold: 1.0,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, lastPageSize]);

  return (
    <div className="space-y-12" ref={containerRef}>
      {categories.map(
        (category: Category) =>
          category.posts.length !== 0 && (
            <CategorySlider
              category={category}
              filterParams={filterParams}
              key={category.value}
            />
          )
      )}

      {isFetchingNextPage && <CategorySliderSkeleton />}
    </div>
  );
}
