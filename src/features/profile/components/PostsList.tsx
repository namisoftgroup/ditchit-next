"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import useGetMyPosts from "@/features/profile/hooks/useGetMyPosts";
import PostCardSkeleton from "@/components/loaders/PostCardSkeleton";
import PostCard from "@/components/cards/PostCard";
import NoDataPlaceHolder from "@/components/shared/NoDataPlaceHolder";

export default function PostsList() {
  const { posts, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetMyPosts();
  const t = useTranslations("common");
  const [filteredPosts, setFilteredPosts] = useState(posts);
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
  console.log("posts ", posts);

  return (
    <section className="flex flex-wrap ">
      <div className="w-full p-2">
        <input
          placeholder={t("search")}
          onChange={(e) => {
            const searchValue = e.target.value.toLowerCase();
            setFilteredPosts(
              posts.filter((post) =>
                post.title.toLowerCase().includes(searchValue)
              )
            );
          }}
          className="w-full border border-gray-100 rounded-4xl py-2 px-5"
        />
      </div>

      {filteredPosts.map((post) => (
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
