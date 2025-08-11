"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "../shared/InputField";

export default function SubscribeModal({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: (open: boolean) => void;
}) {
  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 bg-white shadow-xl space-y-6 rounded-[24px] gap-2">
        <DialogHeader className="mb-0">
          <DialogTitle className="text-[18px] font-bold capitalize">
            Subscribe
          </DialogTitle>

          <div className="flex flex-col gap-3">
            <form className="flex flex-col gap-4 mt-5">
              <InputField label="Phone" id="phone" placeholder="Phone" />

              <InputField
                label="full name"
                id="fullName"
                placeholder="Full Name"
                type="text"
              />

              <button
                type="submit"
                className="customBtn rounded-full mb-5 mt-2 ms-auto me-0"
              >
                send
              </button>
            </form>

            <p className="text-[12px] text-[#777]">
              By subscribing, you will receive messages about our products,
              services and/or informational alerts. The frequency may vary.
              Message and data rates from your phone service may apply. You can
              unsubscribe from texting by replying &ldquo;STOP&rdquo;. You can
              always unsubscribe from emails by clicking an unsubscribe link.
            </p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
