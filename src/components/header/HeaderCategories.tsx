"use client";

import { Fragment } from "react";
import { Category } from "@/types/category";
import { useCategoryVisibility } from "@/hooks/useCategoryVisibility";
import { CategoryLink } from "./CategoryLink";
import { CategoryDropdown } from "./CategoryDropdown";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  categories: Category[];
};

export default function HeaderCategories({ categories }: Props) {
  const {
    containerRef,
    itemRefs,
    visibleCategories,
    overflowCategories,
    isCalculating,
  } = useCategoryVisibility(categories);

  return (
    <div className="w-full hidden md:block">
      <div className="container">
        <div
          ref={containerRef}
          className="flex items-center gap-5 overflow-hidden px-2 py-3"
        >
          {isCalculating ? (
            <div className="flex gap-4 w-full">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-8 basis-0 grow rounded bg-gray-200"
                />
              ))}
            </div>
          ) : (
            <Fragment>
              {/* Visible categories */}
              {visibleCategories.map((cat) => (
                <CategoryLink
                  key={cat.id}
                  category={cat}
                  innerRef={(el) => {
                    if (el) itemRefs.current.set(String(cat.id), el);
                  }}
                />
              ))}

              {overflowCategories.length > 0 && (
                <CategoryDropdown categories={overflowCategories} />
              )}
            </Fragment>
          )}
        </div>

        {/* Hidden measure row */}
        <div
          className="invisible absolute -top-96 start-0 flex gap-4 pointer-events-none"
          aria-hidden="true"
        >
          {categories.map((cat) => (
            <CategoryLink
              key={`measure-${cat.id}`}
              category={cat}
              innerRef={(el) => {
                if (el) itemRefs.current.set(String(cat.id), el);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
