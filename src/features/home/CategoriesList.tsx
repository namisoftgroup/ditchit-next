"use client";

import { useEffect, useRef } from "react";
import { Category } from "./types";
import CategorySlider from "./CategorySlider";
import useGetCategoriesWithPosts from "@/hooks/queries/useGetCategoriesWithPosts";

export default function CategoriesList() {
  const {
    categories,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCategoriesWithPosts();

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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div ref={sectionRef} className="space-y-12">
      {categories.map((category: Category) => (
        <CategorySlider key={category.value} category={category} />
      ))}

      {isFetchingNextPage && (
        <div className="text-center mt-6 text-gray-500">Loading more...</div>
      )}
    </div>
  );
}
