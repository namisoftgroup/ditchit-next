"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "../shared/InputField";
import { useTranslations } from "next-intl";

export default function SubscribeModal({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: (open: boolean) => void;
}) {
  const t = useTranslations("common");

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 bg-white shadow-xl space-y-6 rounded-[24px] gap-2">
        <DialogHeader className="mb-0">
          <DialogTitle className="text-[18px] font-bold capitalize">
            {t("subscribe")}
          </DialogTitle>

          <div className="flex flex-col gap-3">
            <form className="flex flex-col gap-4 mt-5">
              <InputField label={t("phone")} id="phone" placeholder={t("phone")} />

              <InputField
                label={t("full_name")}
                id="fullName"
                placeholder={t("full_name")}
                type="text"
              />

              <button
                type="submit"
                className="customBtn rounded-full mb-5 mt-2 ms-auto me-0"
              >
                {t("send")}
              </button>
            </form>

            <p className="text-[12px] text-[#777]">
              {t("subscribe_text")}
            </p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
