"use client";

import useGetMyPosts from "@/hooks/queries/useGetMyPosts";
import PostCardSkeleton from "@/components/loaders/PostCardSkeleton";
import PostCard from "@/components/cards/PostCard";
import NoDataPlaceHolder from "@/components/shared/NoDataPlaceHolder";

export default function PostsList() {
  const { data, isLoading } = useGetMyPosts();

  return (
    <section className="flex flex-wrap -mx-2">
      {data?.data.map((post, index) => (
        <div key={index} className="w-full lg:w-4/12 p-2">
          <PostCard post={post} showActions={true} />
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

      {data?.data.length === 0 && (
        <div className="w-full flex flex-col justify-center items-center">
          <NoDataPlaceHolder />
          You have no posts yet
        </div>
      )}
    </section>
  );
}
