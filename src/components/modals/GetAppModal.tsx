"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import Image from "next/image";

type GetAppModalProps = {
  show: boolean;
  handleClose: () => void;
};

export default function GetAppModal({ show, handleClose }: GetAppModalProps) {
  const t = useTranslations("common");

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 bg-white shadow-xl space-y-6 rounded-[24px] gap-2">
        <DialogHeader className="mb-0">
          <DialogTitle className="text-[28px] font-bold capitalize text-center">
            Get the free
            <span className="text-[var(--mainColor)]"> DitchIt</span> app
          </DialogTitle>
          
        </DialogHeader>

        <p className="text-sm text-gray-600 text-center mb-0">
          {t("scan_code")}
        </p>

        <Image
          src="/icons/redirectDitchit.svg"
          alt="QR Code"
          width={250}
          height={250}
          className="mx-auto my-5 aspect-square object-contain"
        />

        <div className="flex justify-center items-center gap-2">
          <a
            href="https://apps.apple.com/us/app/ditch-it/id6504569238"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/appStore.svg"
              alt="App Store"
              width={130}
              height={40}
            />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.app.ditchIt"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/playStore.svg"
              alt="Play Store"
              width={130}
              height={40}
            />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
