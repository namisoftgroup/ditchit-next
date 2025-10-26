"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import useGetMyPosts from "@/features/profile/hooks/useGetMyPosts";
import PostCardSkeleton from "@/components/loaders/PostCardSkeleton";
import PostCard from "@/components/cards/PostCard";
import NoDataPlaceHolder from "@/components/shared/NoDataPlaceHolder";
import { ListFilter, Search } from "lucide-react";

export default function PostsList() {
  const { posts, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetMyPosts();
  const t = useTranslations();
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

  return (
    <section className="flex flex-wrap ">
      <div className="w-full p-2 relative mb-4">
        <input
          placeholder={t("common.search")}
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
        <button
          type="submit"
          className="absolute end-3 top-5  p-0 w-9 flex items-center justify-center rounded-xl text-[var(--mainColor)]"
        >
          <Search height={20} width={20} />
        </button>
              <button
        className="ms-auto flex items-center gap-2 text-[14px] md:hidden"
        // onClick={() => setOpenFilter(true)}
      >
        <ListFilter width={16} height={16} /> {t("sort_by")}
      </button>

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
          {t("post.no_posts")}
        </div>
      )}
    </section>
  );
}
