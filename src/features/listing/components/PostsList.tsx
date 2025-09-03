"use client";

import { useEffect, useRef } from "react";
import PostCard from "@/components/cards/PostCard";
import PostCardSkeleton from "@/components/loaders/PostCardSkeleton";
import useGetPostsList from "@/features/listing/useGetPostsList";

type PostListProps = {
  userId: number | null;
  longitude: string | null;
  latitude: string | null;
  kilometers: string | null;
  delivery_method: string | null;
};

export default function PostsList(props: PostListProps) {
  const { posts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPostsList(
      props.userId,
      props.longitude,
      props.latitude,
      props.kilometers,
      props.delivery_method,
    );

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "1200px" }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="flex flex-wrap ">
      {posts.map((post) => (
        <div key={post.id} className="w-full lg:w-4/12 p-2">
          <PostCard post={post} showActions={false} />
        </div>
      ))}

      {(isFetchingNextPage || isLoading) &&
        Array.from({ length: 3 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="w-full lg:w-4/12 p-2">
            <PostCardSkeleton />
          </div>
        ))}

      <div ref={observerRef} />
    </div>
  );
}
