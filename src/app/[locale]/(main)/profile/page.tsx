import { getMyPosts, MyPostsResponse } from "@/features/profile/service";
import { getQueryClient } from "@/utils/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import PostsList from "@/features/profile/components/PostsList";

export default async function Page() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["my-posts"],
    queryFn: ({ pageParam = 1 }) => getMyPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (
      lastPage: MyPostsResponse,
      _: unknown,
      lastPageParam: number
    ) => {
      const posts = lastPage?.data ?? [];
      if (posts.length === 0) return undefined;
      return lastPageParam + 1;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsList />
    </HydrationBoundary>
  );
}
