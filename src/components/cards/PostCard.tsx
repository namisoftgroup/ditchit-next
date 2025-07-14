"use client";

import { Post } from "@/types/post";
import {
  Clock,
  EllipsisVertical,
  FilePenLine,
  Heart,
  MapPin,
  Megaphone,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import useStoreFavorites from "@/hooks/useStoreFavorites";

export default function PostCard({
  post,
  showActions,
}: {
  post: Post;
  showActions: boolean;
}) {
  const { storeFavorites } = useStoreFavorites();

  return (
    <div className="relative flex flex-col gap-1 h-full rounded-2xl border border-[var(--lightBorderColor)] bg-[var(--whiteColor)] transition-all">
      {!showActions && (
        <button
          onClick={() => storeFavorites(post?.id)}
          className={`absolute top-4 left-4 z-20 w-8 h-8 flex items-center justify-center rounded-full text-[var(--whiteColor)] bg-black/30 backdrop-blur-sm transition-all hover:bg-red-600 ${post.is_love ? "bg-red-600" : ""}`}
        >
          <Heart width={18} height={18} />
        </button>
      )}

      {showActions && (
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-9 w-9 rounded-full flex items-center justify-center bg-white border border-[var(--lightBorderColor)] ">
              <EllipsisVertical width={16} height={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[var(--whiteColor)] shadow-[0_2px_8px_rgba(0,0,0,0.1)] z-[99999] min-w-[100px] flex-col rounded border border-[var(--lightBorderColor)] max-h-[400px] overflow-y-auto">
              <DropdownMenuItem asChild>
                <button className="flex items-center gap-2 w-full whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm">
                  <Megaphone
                    width={16}
                    height={16}
                    className="text-[var(--mainColor)]"
                  />
                  Promote
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <button className="flex items-center gap-2 w-full whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm">
                  <FilePenLine width={16} height={16} />
                  Edit
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <button className="flex items-center gap-2 w-full whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm">
                  <Trash width={16} height={16} className="text-[#FF0000]" />
                  Delete
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="bg-white rounded-[40px] px-3 py-1 text-[var(--darkColor)] block border border-[var(--lightBorderColor)]">
            Available
          </span>
        </div>
      )}

      {/* Item Image */}
      <Link
        href={`/all-posts/${post.id}`}
        className="relative overflow-hidden rounded-t-2xl aspect-[3/2] w-full max-h-[300px] transition-all"
      >
        <Image
          src={post.image}
          alt="item"
          width={500}
          height={300}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-all hover:scale-110"
        />

        {post.is_promoted && (
          <Image
            src="/icons/promoted.svg"
            alt="promoted"
            width={24}
            height={24}
            className="absolute bottom-0 left-0 z-20 w-10 aspect-square bg-white rounded-t-md p-2"
          />
        )}

        <div className="absolute top-0 left-[-80%] w-1/2 h-full z-10 bg-gradient-to-r from-transparent to-white/30 skew-x-[-25deg]" />
      </Link>

      {/* Info Section */}
      <div className="relative flex flex-col gap-2 p-4 text-[var(--darkColor)] flex-1">
        {/* <Link href="/profile" className="absolute top-[-28px] right-4 z-30">
          <Image
            src="/images/avatar.svg"
            alt="user"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover border-2 border-[var(--whiteColor)] hover:border-[var(--mainColor)] transition-all"
          />
        </Link> */}

        <div className="flex items-center gap-1 text-sm text-[var(--grayColor)]">
          <Clock width={16} height={16} />
          <span>{post.publishing_duration}</span>
        </div>

        <Link
          href={`/all-posts/${post.id}`}
          className="font-bold text-[16px] overflow-hidden line-clamp-1"
        >
          {post.title}
        </Link>

        <p className="text-[var(--grayColor)] flex-1 text-[13px] overflow-hidden max-h-[40px] line-clamp-2">
          {post.description}
        </p>

        <div className="flex items-center gap-1 text-[13px] text-[var(--grayColor)]">
          <MapPin width={16} height={16} />
          <span>{post.address}</span>
        </div>
        {post.is_promoted && (
          <span className="capitalize text-[var(--mainColor)]">promoted</span>
        )}

        <div className="flex items-center justify-between pt-3 mt-auto border-t border-[var(--lightBorderColor)]">
          <Link
            href={`/all-posts?category_id=${post.category.id}`}
            className="flex items-center gap-1 text-sm"
          >
            <span className="w-10 h-10 rounded-full bg-[var(--mainColor10)] flex items-center justify-center">
              <Image
                src={post.category.image}
                alt="category"
                width={20}
                height={20}
                className="object-contain"
              />
            </span>
            {post.category.title}
          </Link>

          <div className="text-lg font-bold">
            <span>$ {post.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
