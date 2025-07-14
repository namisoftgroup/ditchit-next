"use client";

import PostCardSkeleton from "@/components/loaders/PostCardSkeleton";
import PostCard from "@/components/cards/PostCard";
import useGetMyFavorites from "@/hooks/queries/useGetFavorites";

export default function FavoritesList() {
  const { data, isLoading } = useGetMyFavorites();

  return (
    <section className="flex flex-wrap -mx-2">
      {data?.data.map((post, index) => (
        <div key={index} className="w-full lg:w-4/12 p-2">
          <PostCard post={post} />
        </div>
      ))}

      {isLoading && (
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
