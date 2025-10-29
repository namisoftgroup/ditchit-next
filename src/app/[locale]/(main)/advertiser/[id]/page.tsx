import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getAdvertiserServerPosts } from "@/features/advertiser/service";
import { advertiserResponse } from "@/features/advertiser/types";
import { getQueryClient } from "@/utils/queryClient";
import { getTranslations } from "next-intl/server";
import PageBanner from "@/components/shared/PageBanner";
import AdvertiserPostsList from "@/features/advertiser/components/AdvertiserPostsList";
import AdvertiserCard from "@/features/advertiser/components/AdvertiserCard";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const t = await getTranslations("common");

  const id = (await params).id;
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["advertiser-posts", id],
    queryFn: ({ pageParam = 1 }) =>
      getAdvertiserServerPosts(id as string, pageParam),
    initialPageParam: 1,
    getNextPageParam: (
      lastPage: advertiserResponse,
      _: unknown,
      lastPageParam: number
    ) => {
      const posts = lastPage?.data?.posts ?? [];
      if (posts.length === 0) return undefined;
      return lastPageParam + 1;
    },
  });

  return (
    <>
      <PageBanner
        links={[{ title: t("home"), link: "/" }]}
        page={t("advertiser")}
      />

      <div className="container py-4">
        <div className="flex flex-wrap ">
          <div className="w-full lg:w-3/12 px-2 pb-2 pt-4">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <AdvertiserCard id={id} />
            </HydrationBoundary>
          </div>

          <div className="w-full lg:w-9/12 px-2 py-2">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <AdvertiserPostsList advertiserId={id as string} />
            </HydrationBoundary>
          </div>
        </div>
      </div>
    </>
  );
}
