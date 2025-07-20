"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type confirmModalProps = {
  show: boolean;
  text: string;
  modalTitle: string;
  isPending: boolean;
  event: () => void;
  handleClose: () => void;
};

export default function ConfirmModal({
  show,
  modalTitle,
  text,
  event,
  isPending,
  handleClose,
}: confirmModalProps) {
  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 bg-white shadow-xl space-y-6 rounded-[24px] gap-2">
        <DialogHeader className="mb-0">
          <DialogTitle className="text-[18px] font-bold capitalize">
            {modalTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="pt-4">
          <p className="text-[14px]">{text}</p>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--lightBorderColor)] mb-0 pt-4">
          <button
            type="submit"
            className="customBtn danger rounded-full w-fit px-12 ms-auto me-0 mb-0"
            disabled={isPending}
            onClick={event}
          >
            {isPending ? "loading..." : "confirm"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
