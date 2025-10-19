"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import PostCard from "@/components/cards/PostCard";
import PostCardSkeleton from "@/components/loaders/PostCardSkeleton";
import useGetAdvertiserPosts from "@/features/advertiser/useGetAdvertiserPosts";
import NoDataPlaceHolder from "@/components/shared/NoDataPlaceHolder";

export default function AdvertiserPostsList({
  advertiserId,
}: {
  advertiserId: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("common");

  const { posts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAdvertiserPosts(advertiserId);

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
    <div ref={sectionRef} className="flex flex-wrap ">
      {(isFetchingNextPage || isLoading) && (
        <>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-full lg:w-4/12 p-2">
              <PostCardSkeleton />
            </div>
          ))}
        </>
      )}

      {posts.length === 0 && (
        <div className="w-full flex flex-col justify-center items-center">
          <NoDataPlaceHolder />
          {t("no_posts_found")}
        </div>
      )}

      {posts.map((post, index) => (
        <div key={index} className="w-full lg:w-4/12 p-2">
          <PostCard post={post} showActions={false} />
        </div>
      ))}
    </div>
  );
}
