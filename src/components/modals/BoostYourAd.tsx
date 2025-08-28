"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type GetAppModalProps = {
  show: boolean;
  postId: number;
  handleClose: () => void;
};

export default function BoostYourAd({
  show,
  postId,
  handleClose,
}: GetAppModalProps) {
  const t = useTranslations("post");

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 bg-white shadow-xl space-y-6 rounded-[24px] gap-2">
        <DialogHeader className="mb-0">
          <DialogTitle className="text-[18px] font-bold capitalize">
            {t("boost_ad")}
          </DialogTitle>
        </DialogHeader>

        <div className="pt-4">
          <p className="text-[14px]">
            {t("promote_text_1")}{" "}
            <span className="font-bold text-[var(--mainColor)]">1.99$</span>{" "}
            {t("promote_text_2")}{" "}
            <span className="font-bold text-[var(--mainColor)]">
              {t("five_days")}
            </span>{" "}
            .{t("promote_text_3")}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--lightBorderColor)] mb-0 pt-4">
          <Link
            className="customBtn rounded-full w-fit px-12 ms-auto me-0 mb-0"
            href={`https://ditchit.com/api/promote-payment/${postId}`}
          >
            {t("boost_now")}
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
