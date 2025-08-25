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
  const { categories, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetCategoriesWithPosts(filterParams);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "1200px",
      }
    );

    observer.observe(observerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="space-y-12">
      {categories.map((category: Category) => (
        <CategorySlider
          key={category.value}
          category={category}
          filterParams={filterParams}
        />
      ))}

      {isFetchingNextPage && <CategorySliderSkeleton />}

      <div ref={observerRef} />
    </div>
  );
}
