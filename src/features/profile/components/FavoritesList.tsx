"use client";

import { useTranslations } from "next-intl";
import PostCard from "@/components/cards/PostCard";
import useGetMyFavorites from "@/features/profile/hooks/useGetFavorites";
import NoDataPlaceHolder from "@/components/shared/NoDataPlaceHolder";
import PostCardSkeleton from "@/components/loaders/PostCardSkeleton";

export default function FavoritesList() {
  const { posts, isLoading } = useGetMyFavorites();
  const t = useTranslations("post");

  return (
    <section className="flex flex-wrap ">
      {posts.map((post) => (
        <div key={post.id} className="w-full lg:w-4/12 p-2">
          <PostCard post={post} showActions={false} />
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

      {posts.length === 0 && (
        <div className="w-full flex flex-col justify-center items-center">
          <NoDataPlaceHolder />
          {t("no_favs")}
        </div>
      )}
    </section>
  );
}
