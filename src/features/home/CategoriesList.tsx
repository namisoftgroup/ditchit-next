"use client";

import { useEffect, useRef } from "react";
import { Category } from "./types";
import CategorySlider from "./CategorySlider";
import useGetCategoriesWithPosts from "@/hooks/queries/useGetCategoriesWithPosts";
import CategorySliderSkeleton from "./CategorySliderSkeleton";

export default function CategoriesList() {
  const { categories, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetCategoriesWithPosts();

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const sectionBottom = section.getBoundingClientRect().bottom;
      const viewportHeight = window.innerHeight;

      if (
        sectionBottom <= viewportHeight + 200 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div ref={sectionRef} className="space-y-12">
      {categories.map((category: Category) => (
        <CategorySlider key={category.value} category={category} />
      ))}

      {isFetchingNextPage && <CategorySliderSkeleton />}
    </div>
  );
}
