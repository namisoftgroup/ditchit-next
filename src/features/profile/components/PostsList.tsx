"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import useGetMyPosts from "@/features/profile/hooks/useGetMyPosts";
import PostCardSkeleton from "@/components/loaders/PostCardSkeleton";
import PostCard from "@/components/cards/PostCard";
import NoDataPlaceHolder from "@/components/shared/NoDataPlaceHolder";

export default function PostsList() {
  const { posts, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetMyPosts();
  const t = useTranslations("post");

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(observerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <section className="flex flex-wrap -mx-2">
      {posts.map((post) => (
        <div key={post.id} className="w-full lg:w-4/12 p-2">
          <PostCard post={post} showActions={true} />
        </div>
      ))}

      {isFetchingNextPage && (
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
          {t("no_posts")}
        </div>
      )}
    </section>
  );
}
