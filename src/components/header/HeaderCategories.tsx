"use client";

import { useState, useEffect, useRef } from "react";
import { Category } from "@/types/category";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";

type Props = {
  categories: Category[];
};

export default function HeaderCategories({ categories }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(categories.length);

  const ITEM_WIDTH = 136;

  useEffect(() => {
    if (!containerRef.current) return;

    function updateVisibleCount() {
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const count = Math.floor(containerWidth / ITEM_WIDTH);
      setVisibleCount(count > 0 ? count : 1);
    }

    updateVisibleCount();

    const resizeObserver = new ResizeObserver(() => {
      updateVisibleCount();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [categories.length]);

  const visible = categories.slice(0, visibleCount);
  const overflow = categories.slice(visibleCount);

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-4 overflow-x-auto py-2 mx-auto"
    >
      {visible.map((cat) => (
        <Link
          key={cat.id}
          href={`/all-posts?category=${cat.id}`}
          className="flex items-center gap-2 text-sm hover:text-blue-600 whitespace-nowrap"
        >
          <Image src={cat.image} alt={cat.title} width={20} height={20} />
          {cat.title}
        </Link>
      ))}

      {overflow.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 text-sm hover:text-blue-600 whitespace-nowrap">
            <Image src="/icons/more.svg" alt="more" width={20} height={20} />
            More
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-[var(--whiteColor)] shadow-[0_2px_8px_rgba(0,0,0,0.1019607843)] min-w-[200px] z-20  flex-col rounded border border-[var(--lightBorderColor)] max-h-[400px] overflow-y-auto">
            {overflow.map((cat) => (
              <DropdownMenuItem key={cat.id} asChild>
                <Link
                  href={`/all-posts?category=${cat.id}`}
                  className="flex items-center gap-2 whitespace-nowrap hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm"
                >
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    width={20}
                    height={20}
                  />
                  {cat.title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
