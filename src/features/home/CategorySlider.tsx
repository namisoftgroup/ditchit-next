"use client";

import Link from "next/link";
import { Category } from "./types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PostCard from "@/components/cards/PostCard";

export default function CategorySlider({ category }: { category: Category }) {
  return (
    <section className="py-[60px] m-0 even:bg-[#f5f5f5]">
      <div className="container">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
          <div className="px-2">
            <span className="block text-[14px] font-semibold not-italic tracking-[2.8px] uppercase text-[var(--mainColor)]">
              {category.title}
            </span>
            <Link href={`/all-posts?category_id=${category.value}`}>
              <h4 className="text-[40px] font-bold text-[var(--darkColor)]">
                Browse items by{" "}
                <span className="text-[var(--mainColor)]">
                  {category.title}
                </span>
              </h4>
            </Link>
          </div>
        </div>

        {/* Carousel section */}
        <div className="relative">
          <Carousel opts={{ align: "start" }} className="w-full relative">
            <div className="flex justify-end gap-2 mb-4 pr-4">
              <CarouselPrevious className="absolute -top-16 right-16 left-initial" />
              <CarouselNext className="absolute -top-16 right-4" />
            </div>

            <CarouselContent>
              {category.posts.map((post) => (
                <CarouselItem
                  key={post.id}
                  className="md:basis-1/2 lg:basis-1/4"
                >
                  <div className="p-1 h-full">
                    <PostCard post={post} showActions={false} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
