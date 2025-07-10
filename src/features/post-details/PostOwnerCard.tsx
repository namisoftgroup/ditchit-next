import { MessagesSquare, PhoneCall } from "lucide-react";
import { User } from "@/types/user";
import Link from "next/link";
import Image from "next/image";

export default function PostOwnerCard({
  owner,
  postId,
}: {
  owner: User;
  postId: number;
}) {
  return (
    <div className="flex flex-col gap-2 border border-[var(--lightBorderColor)] rounded-[16px] p-6 text-center bg-[var(--whiteColor)] bg-[url('/images/imgStatus.svg')] bg-no-repeat bg-[length:150px] bg-[position:top_right]">
      <Link
        href={`/profile/${owner.id}`}
        className="flex flex-col items-center gap-2"
      >
        <Image src={owner.image} alt="user" width={120} height={120} className="rounded-full max-w-[120px] max-h-[120px] object-cover" />
        <h3 className="font-bold transition-all capitalize text-[20px]">
          {owner.name}
        </h3>
        <span className="text-[var(--grayColor)] text-[13px]">
          Member : 1 day ago
        </span>
      </Link>

      <div className="flex items-center gap-2 p-2">
        <Link href={`/chats?post_id=${postId}`} className="flex-1 px-4 py-3 rounded-[16px] flex items-center justify-center gap-2 bg-[var(--mainColor)] text-[var(--whiteColor)] capitalize text-[16px]">
          <MessagesSquare />
          <span> chat </span>
        </Link>
        <Link href={`tel:${owner.phone}`} className="flex-1 px-4 py-3 rounded-[16px] flex items-center justify-center gap-2 bg-[#2562d3] text-[var(--whiteColor)] capitalize text-[16px]">
          <PhoneCall />
          <span> call </span>
        </Link>
      </div>
    </div>
  );
}
