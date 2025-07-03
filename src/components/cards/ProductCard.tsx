"use client";

import { Clock, Heart, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard() {
  return (
    <div className="relative flex flex-col gap-1 h-full rounded-2xl border border-[var(--lightBorderColor)] bg-[var(--whiteColor)] transition-all">
      {/* Favorite Button */}
      <button className="absolute top-4 left-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-all hover:bg-red-600">
        <Heart />
      </button>

      {/* Item Image */}
      <Link
        href="/itemDetails.html"
        className="relative overflow-hidden rounded-t-2xl aspect-[3/2] w-full max-h-[300px] transition-all"
      >
        <Image
          src="/images/product.webp"
          alt="item"
          width={500}
          height={300}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-all hover:scale-110"
        />
        <div className="absolute top-0 left-[-80%] w-1/2 h-full z-10 bg-gradient-to-r from-transparent to-white/30 skew-x-[-25deg]" />
      </Link>

      {/* Info Section */}
      <div className="relative flex flex-col gap-2 p-4 text-[var(--darkColor)] flex-1">
        <Link
          href="/advertiser.html"
          className="absolute top-[-28px] right-4 z-30"
        >
          <Image
            src="/images/avatar.svg"
            alt="user"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover border-2 border-[var(--whiteColor)] hover:border-[var(--mainColor)] transition-all"
          />
        </Link>

        <div className="flex items-center gap-1 text-sm text-[var(--grayColor)]">
          <Clock />
          <span>1h ago</span>
        </div>

        <Link href="/itemDetails.html" className="font-bold text-sm">
          Apple MacBook Air (2023) Apple M2 Chip
        </Link>

        <p className="text-[13px] text-[var(--grayColor)]">
          The Apple MacBook Air 13.6-Inch laptop is powered by the new M2 chip.
          It is loaded with 8GB RAM and 256GB SSD.
        </p>

        <div className="flex items-center gap-1 text-[13px] text-[var(--grayColor)]">
          <MapPin />
          <span>USA, California</span>
        </div>

        <span className="capitalize text-[var(--mainColor)]">promoted</span>

        <div className="flex items-center justify-between pt-3 mt-2 border-t border-[var(--lightBorderColor)]">
          <Link
            href="/listing.html"
            className="flex items-center gap-1 text-sm"
          >
            <span className="w-10 h-10 rounded-full bg-[var(--mainColor10)] flex items-center justify-center">
              <Image
                src="/images/category.svg"
                alt="category"
                width={20}
                height={20}
                className="object-contain"
              />
            </span>
            Electronics
          </Link>
          <div className="text-lg font-bold">
            <span>$ 1,200</span>
          </div>
        </div>
      </div>
    </div>
  );
}
