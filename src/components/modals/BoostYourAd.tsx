"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

type GetAppModalProps = {
  show: boolean;
  handleClose: () => void;
};

export default function BoostYourAd({ show, handleClose }: GetAppModalProps) {
  const [isPending, ] = useState<boolean>(false);

  // const handlePromote = async () => {
  //   setIsPending(true);

  //   try {
  //       const res = await clientAxios.post("/ads/promote");
        
  //   } catch (error) {
  //       console.log(error);
        
  //   }
  // }

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 bg-white shadow-xl space-y-6 rounded-[24px] gap-2">
        <DialogHeader className="mb-0">
          <DialogTitle className="text-[18px] font-bold capitalize">
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

        <div className="flex items-center justify-between border-t border-[var(--lightBorderColor)] mb-0 pt-4">
          <button
            type="submit"
            className="customBtn rounded-full w-fit px-12 ms-auto me-0 mb-0"
            disabled={isPending}
          >
            {isPending ? "Promoting..." : "Promote"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
