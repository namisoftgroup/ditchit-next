"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import TextField from "../shared/TextField";
import useReportPost from "@/features/post-details/useReportPost";

export default function ReportPost({
  show,
  handleClose,
  postId,
}: {
  show: boolean;
  handleClose: (open: boolean) => void;
  postId: number;
}) {
  const t = useTranslations("common");
  const [reason, setReason] = useState("");
  const { reportPostMutation, isPending } = useReportPost(handleClose);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    reportPostMutation({ postId, reason });
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 bg-white shadow-xl space-y-6 rounded-[24px] gap-2">
        <DialogHeader className="mb-0">
          <DialogTitle className="text-[18px] font-bold capitalize">
            {t("report_post")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5 mb-0">
          <TextField
            id="description"
            placeholder={t("write_here")}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isPending}
          />

          <button
            type="submit"
            disabled={isPending}
            className="customBtn rounded-full mb-0 mt-2 ms-auto me-0"
          >
            {isPending ? t("loading") : t("send")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
