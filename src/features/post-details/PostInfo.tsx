"use client";

import { useState } from "react";
import { Clock, Heart, MapPin } from "lucide-react";
import { useAuthStore } from "../auth/store";
import { useRouter } from "next/navigation";
import { PostDetailsResponse } from "./types";
import Image from "next/image";
import Link from "next/link";
import useStoreFavorites from "@/hooks/actions/useStoreFavorites";

export default function PostInfo({ post }: { post: PostDetailsResponse }) {
  const optionsToMap = post.options.filter((option) => option.value);
  const [isLove, setIsLove] = useState(post.is_love);

  const { storeFavorites, isPending: isPendingFav } = useStoreFavorites();
  const { token } = useAuthStore();
  const router = useRouter();

  const encodedUrl = encodeURIComponent(
    `https://ditchit.com/all-posts?id=${post.id}`
  );

  const encodedText = encodeURIComponent("DitchIt");

  const handleFav = (id: number) => {
    if (!token) {
      router.push("/login");
      return;
    }

    setIsLove((prev) => !prev);

    storeFavorites(id, {
      onError: () => {
        setIsLove((prev) => !prev);
      },
    });
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 text-[var(--mainColor)] text-[32px] font-bold whitespace-nowrap">
          ${post.price.toFixed(2)}
        </div>

        <button
          onClick={() => handleFav(post.id)}
          disabled={isPendingFav}
          className={`min-w-[42px] h-[42px] flex items-center justify-center rounded-full border border-[var(--darkColor)] transition-all ${isLove ? "bg-[#ff0000]" : ""}`}
        >
          <Heart width={20} height={20} />
        </button>

        <div className="flex items-center flex-wrap gap-4">
          <Link
            href={`/all-posts?category_id=${post.category.id}`}
            className="flex items-center gap-2 border border-[var(--darkColor)] px-3 py-2 rounded-full h-[42px] font-bold text-[14px] transition-colors hover:bg-[var(--mainColor)] hover:text-[var(--whiteColor)] hover:border-[var(--mainColor)] group"
          >
            <Image
              src={post.category.image}
              alt={post.category.title}
              width={16}
              height={16}
              className="filter brightness-0 group-hover:brightness-0 group-hover:invert transition"
            />
            {post.category.title}
          </Link>

          <div className="flex items-center gap-1 p-1 transition-all rounded-full border border-[var(--darkColor)]">
            <span className="ps-2 capitalize font-bold text-[14px]">
              share:
            </span>

            <a
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--whiteColor)] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1da1f2] group"
            >
              <Image
                src="/icons/twitter.svg"
                alt="Twitter"
                width={16}
                height={16}
                className="group-hover:brightness-0 group-hover:invert transition"
              />
            </a>

            <a
              href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--whiteColor)] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#25d366] group"
            >
              <Image
                src="/icons/whatsapp.svg"
                alt="WhatsApp"
                width={16}
                height={16}
                className="group-hover:brightness-0 group-hover:invert transition"
              />
            </a>

            <a
              href={`https://www.instagram.com/?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--whiteColor)] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#e1306c] group"
            >
              <Image
                src="/icons/instagram.svg"
                alt="Instagram"
                width={16}
                height={16}
                className="group-hover:brightness-0 group-hover:invert transition"
              />
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--whiteColor)] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1877f2] group"
            >
              <Image
                src="/icons/facebook.svg"
                alt="Facebook"
                width={16}
                height={16}
                className="group-hover:brightness-0 group-hover:invert transition"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 relative text-[var(--darkColor)]">
        <div className="flex gap-2">
          {post.is_promoted && (
            <span className="inline-flex items-center gap-1 p-2 px-6 rounded-full border border-[var(--mainColor)] w-fit text-sm font-bold uppercase bg-[var(--mainColor20)]">
              <Image
                src="/icons/promoted2.svg"
                width={20}
                height={20}
                alt="Promoted"
              />
              <span className="text-[12px]">Promoted</span>
            </span>
          )}

          <span className="px-4 flex items-center py-1 bg-[var(--mainColor)] text-[var(--whiteColor)] rounded-full w-fit text-[14px]">
            {post.type}
          </span>
        </div>

        <h3 className="text-[20px] font-bold">{post.title}</h3>

        <div className="flex items-center justify-between pt-3 mt-2 border-t border-t-[var(--lightBorderColor)] gap-2 flex-wrap">
          <a
            href={`https://www.google.com/maps?q=${post.latitude},${post.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[13px] text-[var(--grayColor)]"
          >
            <MapPin height={16} width={16} />
            {post.address}
          </a>
          <div className="flex items-center gap-1 text-[13px] text-[var(--grayColor)]">
            <Clock height={16} width={16} />1 week ago
          </div>
        </div>

        <p className="py-4 text-[var(--grayColor)] text-[14px]">
          {post.description}
        </p>

        <div className="flex flex-wrap gap-1">
          <span className="flex justify-center items-center gap-1 bg-[var(--mainColor)] text-[var(--whiteColor)] text-[14px] px-4 py-2 rounded-full">
            {post.condition}
          </span>
          <span className="flex justify-center items-center gap-1 bg-[var(--mainColor)] text-[var(--whiteColor)] text-[14px] px-4 py-2 rounded-full">
            {post.delivery_method}
          </span>
          {post.firm_price && (
            <span className="flex justify-center items-center gap-1 bg-[var(--mainColor)] text-[var(--whiteColor)] text-[14px] px-4 py-2 rounded-full">
              Firm price
            </span>
          )}
        </div>
      </div>

      {optionsToMap.length > 0 && (
        <div className="p-6 border border-[var(--lightBorderColor)] rounded-2xl bg-[var(--whiteColor)]">
          <h4 className="font-bold text-[18px] mb-4 pb-4 border-b border-b-[var(--lightBorderColor)]">
            Key Features
          </h4>
          <ul>
            {optionsToMap.map((option, index) => (
              <li
                key={option.category_option_id}
                className={`flex flex-wrap p-4 rounded-2xl gap-2 ${index % 2 === 0 ? "bg-[#f5f5f5]" : ""}`}
              >
                <span className="text-[14px] flex-1">
                  {option.category_option.title}
                </span>
                <p className="text-[14px] font-bold flex-3">{option.value}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
