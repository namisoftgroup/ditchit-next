"use client";

import { MapPin, PhoneCall, Share2 } from "lucide-react";
import useGetAdvertiserPosts from "@/features/advertiser/useGetAdvertiserPosts";
import Image from "next/image";
import Link from "next/link";

export default function AdvertiserCard({ id }: { id: string }) {
  const { user } = useGetAdvertiserPosts(id);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: user?.name,
          text: `Check out ${user?.name}'s profile`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((error) => console.log("Error copying:", error));
    }
  };

  return (
    <div className="flex flex-col gap-2 shadow-[var(--BigShadow)] rounded-2xl p-6 text-center bg-white mb-8 bg-[url('/icons/imgStatus.svg')] bg-no-repeat bg-[top_right] bg-[length:150px]">
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <Image
            src={user?.image || ""}
            alt="user"
            width={120}
            height={120}
            className="rounded-full w-[120px] h-[120px] object-cover"
          />

          <span
            className="absolute bottom-0 left-0 bg-white text-[var(--mainColor)] border rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
            onClick={handleShare}
          >
            <span className="text-[12px]">
              <Share2 className="w-4 h-4" />
            </span>
          </span>
        </div>

        <h3 className="font-bold transition-all capitalize text-[20px]">
          {user?.name}
        </h3>

        <span className="text-[var(--grayColor)] text-[13px]">
          Member : 1 day ago
        </span>

        <div className="flex items-center justify-center gap-1 text-[13px] text-[var(--grayColor)] [text-wrap:balance]">
          <MapPin className="w-4 h-4" />
          <span> {user?.address} </span>
        </div>

        {user?.phone && (
          <Link
            href={`tel:${user?.phone_code ?? ""}${user?.phone ?? ""}`}
            className="w-full py-[12px] px-[16px] rounded-2xl flex justify-center items-center gap-2 bg-[#2562d3] text-[var(--whiteColor)] mt-2"
          >
            <PhoneCall width={18} height={18} />
            <span> call </span>
          </Link>
        )}
      </div>
    </div>
  );
}
