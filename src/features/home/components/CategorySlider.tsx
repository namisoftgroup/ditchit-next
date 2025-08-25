"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { useMemo, useState } from "react";
import { Category, HomeFilterInterface } from "../types";
import { Navigation } from "swiper/modules";
import PostCardSkeleton from "@/components/loaders/PostCardSkeleton";
import Link from "next/link";
import PostCard from "@/components/cards/PostCard";
import Image from "next/image";
import usePaginateCategory from "../usePaginateCategory";
import "swiper/css";
import "swiper/css/navigation";

export default function CategorySlider({
  category,
  filterParams,
}: {
  category: Category;
  filterParams: HomeFilterInterface;
}) {
  const [enabled, setEnabled] = useState<boolean>(false);

  const {
    posts: extraPosts,
    fetchNextPage,
    isFetchingNextPage,
  } = usePaginateCategory(category.value, filterParams, enabled);

  const combinedPosts = useMemo(
    () => [...(category.posts || []), ...extraPosts],
    [category.posts, extraPosts]
  );

  const handleGetNext = () => {
    setEnabled(true);
    fetchNextPage();
  };

  return (
    <section className="py-[60px] m-0 even:bg-[#f5f5f5]">
      <div className="container">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <div className="px-2">
            <span className="block text-[14px] font-semibold tracking-[2.8px] uppercase text-[var(--mainColor)]">
              {category.title}
            </span>
            <Link href={`/posts?category_id=${category.value}`}>
              <h4 className="md:text-[40px] text-[18px] sm:mt-2 font-bold text-[var(--darkColor)]">
                Browse items by{" "}
                <span className="text-[var(--mainColor)]">
                  {category.title}
                </span>
              </h4>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              className={`rounded-full w-8 h-8 border flex items-center justify-center swiper_prev_${category.value}`}
            >
              <Image
                src="/icons/arrow.svg"
                width={14}
                height={14}
                alt="arrow-prev"
                className="filter brightness-0"
              />
            </button>

            <button
              className={`rounded-full w-8 h-8 border flex items-center justify-center swiper_next_${category.value}`}
            >
              <Image
                src="/icons/arrow.svg"
                width={14}
                height={14}
                alt="arrow-next"
                className="-scale-x-100 filter brightness-0"
              />
            </button>
          </div>
        </div>

        {/* Swiper Section */}
        <div className="relative">
          <Swiper
            spaceBetween={16}
            modules={[Navigation]}
            navigation={{
              nextEl: `.swiper_next_${category.value}`,
              prevEl: `.swiper_prev_${category.value}`,
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            onReachEnd={handleGetNext}
          >
            {combinedPosts.map((post) => (
              <SwiperSlide key={post.id}>
                <div className="p-1 h-full">
                  <PostCard post={post} showActions={false} />
                </div>
              </SwiperSlide>
            ))}

            {isFetchingNextPage && (
              <SwiperSlide>
                <PostCardSkeleton />
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
