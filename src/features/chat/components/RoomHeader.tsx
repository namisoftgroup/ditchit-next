import { Room } from "../types";
import Image from "next/image";
import Link from "next/link";

export default function RoomHeader({ room }: { room: Room }) {
  return (
    <>
      <div className="rounded-t-[14px] flex p-[14px] items-center justify-between gap-4 bg-[#fafafa]">
        <Link href={`/advertiser/${room.another_user_id}`} className="flex items-center gap-2">
          <Image
            src={room.another_user.user.image}
            alt={room.another_user.user.name}
            width={40}
            height={40}
            className="w-[40px] h-[40px] rounded-full object-cover"
          />
          <h6 className="text-[14px] font-bold">
            {room.another_user.user.name}
          </h6>
        </Link>
      </div>

      <Link
        href={`/all-posts/${room.post_id}`}
        className="flex items-center gap-4 p-2 bg-[#e5f6ed]"
      >
        <Image
          width={40}
          height={40}
          src={room.post.image}
          alt={room.post.title}
          className="rounded-[8px] w-[40px] h-[40px] object-cover"
        />
        <p className={"text-[14px] text-[var(--mainColor)]"}>
          {room.post.title}
        </p>
      </Link>
    </>
  );
}
