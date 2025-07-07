"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function PostCardSkeleton() {
  return (
    <div className="relative flex flex-col gap-1 h-full rounded-2xl border border-[var(--lightBorderColor)] bg-[var(--whiteColor)]">
      {/* Favorite Button */}
      <div className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-gray-300 backdrop-blur-sm" />

      {/* Image */}
      <div className="relative overflow-hidden rounded-t-2xl aspect-[3/2] w-full max-h-[300px]">
        <Skeleton className="w-full h-full  bg-gray-200" />
        <div className="absolute top-0 left-[-80%] w-1/2 h-full z-10 bg-gradient-to-r from-transparent to-white/30 skew-x-[-25deg]" />
      </div>

      {/* Info Section */}
      <div className="relative flex flex-col gap-2 p-4 flex-1">
        {/* Avatar */}
        {/* <div className="absolute top-[-28px] right-4 z-30  bg-gray-300 rounded-full">
          <Skeleton className="w-12 h-12 rounded-full border-2 border-[#e7e7e7]  bg-gray-200" />
        </div> */}

        {/* Time */}
        <div className="flex items-center gap-1 text-sm">
          <Skeleton className="w-4 h-4 rounded-full  bg-gray-200" />
          <Skeleton className="h-3 w-24  bg-gray-200" />
        </div>

        {/* Title */}
        <Skeleton className="h-4 w-3/4  bg-gray-200" />

        {/* Description */}
        <Skeleton className="h-3 w-full  bg-gray-200" />
        <Skeleton className="h-3 w-[90%]  bg-gray-200" />

        {/* Address */}
        <div className="flex items-center gap-1 text-sm">
          <Skeleton className="w-4 h-4 rounded-full  bg-gray-200" />
          <Skeleton className="h-3 w-24  bg-gray-200" />
        </div>

        {/* Promoted */}
        <Skeleton className="h-3 w-20  bg-gray-200" />

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-[var(--lightBorderColor)]">
          {/* Category */}
          <div className="flex items-center gap-1">
            <Skeleton className="w-10 h-10 rounded-full  bg-gray-200" />
            <Skeleton className="h-3 w-24  bg-gray-200" />
          </div>

          {/* Price */}
          <Skeleton className="h-4 w-12  bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
