"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface SearchByModalProps {
  show: boolean;
  handleClose: () => void;
}

export default function SearchByModal({
  show,
  handleClose,
}: SearchByModalProps) {
  return (
    <Dialog open={show} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md p-6 rounded-lg bg-white shadow-xl space-y-6">
        {/* Header */}
        <DialogHeader className="relative">
          <DialogTitle className="text-[28px] font-bold">Location</DialogTitle>
          <DialogClose className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none" />
        </DialogHeader>

        {/* Delivery Methods */}
        <div className="flex flex-col gap-1">
          <label className="font-bold mb-2">Delivery methods</label>
          {["Local + Shipping", "Local", "Shipping"].map((method) => (
            <div className="flex items-center gap-1" key={method}>
              <input
                type="radio"
                name="methods"
                className="w-5 aspect-square"
                id={method}
              />
              <label htmlFor={method} className="capitalize">
                {method}
              </label>
            </div>
          ))}
        </div>

        {/* ZIP Code */}
        <div className="flex flex-col gap-1">
          <label className="font-bold mb-2">ZIP Code</label>
          <div className="flex justify-between items-center cursor-pointer  border-0">
            <p className="text-sm text-dark">Astoria, NY 11101, USA</p>
            <span className="text-lg font-bold">&gt;</span>
          </div>
        </div>

        {/* Distance Range */}
        <div className="flex flex-col gap-2">
          <label htmlFor="distanceRange" className="font-bold">
            Miles:
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              id="distanceRange"
              name="distanceRange"
              min="0"
              max="100"
              step="1"
              className="flex-1 h-[10px] rounded-full bg-[#ddd] accent-[var(--mainColor)] appearance-none"
            />
            <div className="relative min-w-[100px] px-6 py-2 bg-[var(--mainColor)] text-[var(--whiteColor)] rounded-md flex justify-center items-center gap-1 text-sm">
              <span className="font-bold">Maximum</span>
              <div className="absolute w-4 h-4 bg-[var(--mainColor)] rotate-45 left-[-8px] top-1/2 -translate-y-1/2 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="w-full px-4 py-2 rounded-full bg-[var(--mainColor)] text-white font-medium">
            See listings
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
