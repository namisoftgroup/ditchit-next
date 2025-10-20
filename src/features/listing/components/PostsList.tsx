"use client";

import { useEffect, useRef } from "react";
import PostCard from "@/components/cards/PostCard";
import PostCardSkeleton from "@/components/loaders/PostCardSkeleton";
import useGetPostsList from "@/features/listing/useGetPostsList";
import NoDataPlaceHolder from "@/components/shared/NoDataPlaceHolder";
import { useTranslations } from "next-intl";

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
      props.delivery_method
    );
  const t = useTranslations("common");
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
      {posts.map((post ,index) => (
        <div key={`${post.id || 'post'}-${index}`} className="w-full lg:w-4/12 p-2">
          <PostCard post={post} showActions={false} />
        </div>
      ))}

      {posts.length === 0 && (
        <div className="w-full flex flex-col justify-center items-center py-4">
          <NoDataPlaceHolder />
          <h4 className="font-bold text-[#000] text-[18px] mb-2">
            {t("no_available")}
          </h4>
          <p className="text-sm text-gray-600">{t("no_available_text")}</p>
        </div>
      )}
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
