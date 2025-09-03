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

  return (
    <div className="space-y-12">
      {categories.map(
        (category: Category) =>
          category.posts.length !== 0 && (
            <CategorySlider
              key={category.value}
              category={category}
              filterParams={filterParams}
            />
          )
      )}

      {isFetchingNextPage && <CategorySliderSkeleton />}

      <div ref={bottomRef} />
    </div>
  );
}
