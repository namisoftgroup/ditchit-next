"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type GetAppModalProps = {
  show: boolean;
  isSaving: boolean;
  addPost: () => void;
  handleClose: () => void;
  addAndPromote: () => void;
};

export default function BoostAndPublish({
  show,
  isSaving,
  addPost,
  addAndPromote,
  handleClose,
}: GetAppModalProps) {
  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 bg-white shadow-xl space-y-6 rounded-[24px] gap-2">
        <DialogHeader className="mb-0">
          <DialogTitle className="text-[18px] text-start font-bold capitalize">
            Boost Your Ad!
          </DialogTitle>
        </DialogHeader>

        <div className="pt-4">
          <p className="text-[14px]">
            Get more visibility for your listings! Promote your ad for just{" "}
            <span className="font-bold text-[var(--mainColor)]">1.99$</span> and
            reach more potential buyers for{" "}
            <span className="font-bold text-[var(--mainColor)]">5 days</span> .
            Increase your chances of making a sale today!
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--lightBorderColor)] mb-0 pt-4">
          <button
            className="customBtn rounded-[12px] w-fit md:px-12 px-8 m-0"
            onClick={addPost}
            disabled={isSaving}
          >
            {isSaving ? "loading..." : "Skip & Publish"}
          </button>

          <button
            onClick={addAndPromote}
            disabled={isSaving}
            className="bg-[var(--mainColor)] text-white rounded-[12px] w-fit px-12 py-3 m-0 border border-[var(--mainColor)]"
          >
            {isSaving ? "loading..." : "Promote"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
