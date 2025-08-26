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
  const sectionRef = useRef<HTMLDivElement>(null);

  const { posts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPostsList(
      props.userId,
      props.longitude,
      props.latitude,
      props.kilometers,
      props.delivery_method
    );

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const { bottom } = sectionRef.current.getBoundingClientRect();
      if (
        bottom <= window.innerHeight + 200 &&
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
    <div ref={sectionRef} className="flex flex-wrap -mx-2">
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
    </div>
  );
}
