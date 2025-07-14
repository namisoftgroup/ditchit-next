"use client";

import { useEffect, useRef } from "react";
import useGetMyPosts from "@/hooks/queries/useGetMyPosts";
import PostCardSkeleton from "@/components/loaders/PostCardSkeleton";
import PostCard from "@/components/cards/PostCard";

export default function PostsList() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { posts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetMyPosts();

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
    <section className="flex flex-wrap -mx-2" ref={sectionRef}>
      {posts.map((post, index) => (
        <div key={index} className="w-full lg:w-4/12 p-2">
          <PostCard post={post} />
        </div>
      ))}

      {(isFetchingNextPage || isLoading) && (
        <>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-full lg:w-4/12 p-2">
              <PostCardSkeleton />
            </div>
          ))}
        </>
      )}
    </section>
  );
}
