"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { API_URL } from "@/utils/constants";
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

  function openPaymentPopup() {
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      `${API_URL}/promote-payment/${postId}`,
      "PaymentPopup",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    window.addEventListener("message", (event) => {
      if (event.data.status === "success") {
        toast.success(t("post_promoted"));
      } else if (event.data.status === "failed") {
        toast.error(t("promote_error"));
      }
      handleClose();
    });
  }

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
          <button
            onClick={openPaymentPopup}
            className="customBtn rounded-full w-fit px-12 ms-auto me-0 mb-0"
          >
            {t("boost_now")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
