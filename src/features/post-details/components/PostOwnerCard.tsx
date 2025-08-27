import { User } from "@/types/user";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import ContactOwner from "./ContactOwner";

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
        href={`/advertiser/${owner.id}`}
        className="flex flex-col items-center gap-2"
      >
        <Image
          src={owner.image}
          alt="user"
          width={120}
          height={120}
          className="rounded-full max-w-[120px] max-h-[120px] object-cover"
        />
        <h3 className="font-bold transition-all capitalize text-[20px]">
          {owner.name}
        </h3>
        <span className="text-[var(--grayColor)] text-[13px]">
          Member : 1 day ago
        </span>
      </Link>

      <ContactOwner owner={owner} postId={postId} />
    </div>
  );
}
