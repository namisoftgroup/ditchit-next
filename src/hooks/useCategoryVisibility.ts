import { useEffect, useRef, useState, useCallback } from "react";
import { Category } from "@/types/category";

export function useCategoryVisibility(categories: Category[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
  const [overflowCategories, setOverflowCategories] = useState<Category[]>([]);
  const [isCalculating, setIsCalculating] = useState(true);

  const calculate = useCallback(() => {
    if (!containerRef.current || categories.length === 0) return;

    const containerWidth = containerRef.current.offsetWidth;
    const moreButtonWidth = 150;
    const padding = 32;
    const availableWidth = containerWidth - moreButtonWidth - padding;

    const measurements = new Map<string, number>();
    itemRefs.current.forEach((el, key) => {
      if (el) measurements.set(key, el.offsetWidth + 16);
    });

    let used = 0;
    const visible: Category[] = [];
    const hidden: Category[] = [];

    for (const cat of categories) {
      const key = String(cat.id);
      const width = measurements.get(key) ?? 130;

      if (used + width <= availableWidth && hidden.length === 0) {
        visible.push(cat);
        used += width;
      } else {
        hidden.push(cat);
      }
    }

    if (hidden.length > 0 && visible.length > 0) {
      const last = visible.at(-1);
      if (used > availableWidth) {
        visible.pop();
        hidden.unshift(last!);
      }
    }

    setVisibleCategories(visible);
    setOverflowCategories(hidden);
    setIsCalculating(false);
  }, [categories]);

  useEffect(() => {
    const timer = setTimeout(() => calculate(), 100);
    return () => clearTimeout(timer);
  }, [calculate]);

  useEffect(() => {
    const observer = new ResizeObserver(() => calculate());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [calculate]);

  return {
    containerRef,
    itemRefs,
    visibleCategories,
    overflowCategories,
    isCalculating,
  };
}
