"use client";

import { MessagesSquare, PhoneCall } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { User } from "@/types/user";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import useGenerateRoom from "../useGenerateRoom";
import { useRouter } from "next/navigation";

export default function ContactOwner({
  owner,
  postId,
}: {
  owner: User;
  postId: number;
}) {
  const { user } = useAuthStore();
  const { generateRoom, isPending } = useGenerateRoom();
  const router = useRouter();
  const t = useTranslations("common");

  const startChat = async (postId: number) => {
    if (!user?.id) {
      router.push("/login");
    }
    generateRoom(postId);
  };

  return (
    <>
      {owner.id !== user?.id && (
        <div className="flex items-center gap-2 p-2">
          <button
            className="flex-1 px-4 py-3 rounded-[16px] flex items-center justify-center gap-2 bg-[var(--mainColor)] text-[var(--whiteColor)] capitalize text-[16px]"
            onClick={() => startChat(postId)}
            disabled={isPending}
          >
            {isPending ? (
              t("loading")
            ) : (
              <>
                <MessagesSquare />
                <span> {t("chat")} </span>
              </>
            )}
          </button>
          {owner.phone && (
            <Link
              href={`tel:${owner.phone}`}
              className="flex-1 px-4 py-3 rounded-[16px] flex items-center justify-center gap-2 bg-[#2562d3] text-[var(--whiteColor)] capitalize text-[16px]"
            >
              <PhoneCall />
              <span> {t("call")} </span>
            </Link>
          )}
        </div>
      )}
    </>
  );
}
