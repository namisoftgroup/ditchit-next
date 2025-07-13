"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useHomeFilter } from "@/features/home/store";
import { SHIPPING_METHODS } from "@/utils/constants";

interface SearchByModalProps {
  show: boolean;
  handleClose: () => void;
}

export default function SearchByModal({
  show,
  handleClose,
}: SearchByModalProps) {
  const setFilter = useHomeFilter((state) => state.setFilter);
  const { kilometers } = useHomeFilter((state) => state.filter);

  console.log("kilometers:", kilometers);

  const onUpdateFilter = ({ key, value }: { key: string; value: string }) => {
    setFilter({ [key]: value });
  };

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

          <RadioGroup
            defaultValue={"both"}
            onValueChange={(val) =>
              onUpdateFilter({ key: "delivery_method", value: val })
            }
            className="flex flex-col gap-3"
          >
            {SHIPPING_METHODS.map((item) => (
              <div className="flex items-center gap-3" key={item.value}>
                <RadioGroupItem
                  value={item.value}
                  id={item.value}
                  className="border-[1px] border-[var(--darkColor)] data-[state=checked]:bg-[var(--mainColor)] data-[state=checked]:border-[var(--mainColor)] data-[state=checked]:text-white data-[state=checked]:[&>span>svg]:fill-white"
                />
                <Label htmlFor={item.value}>{item.name}</Label>
              </div>
            ))}
          </RadioGroup>
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
              value={kilometers}
              onChange={(e) =>
                onUpdateFilter({ key: "kilometers", value: e.target.value })
              }
              className="flex-1 h-[10px] rounded-full bg-[#ddd] accent-[var(--mainColor)] appearance-none"
            />
            <div className="relative min-w-[100px] px-6 py-2 bg-[var(--mainColor)] text-[var(--whiteColor)] rounded-md flex justify-center items-center gap-1 text-sm">
              <span className="font-bold">
                {kilometers === 100 ? "Maximum" : `Miles ${kilometers}`}
              </span>
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
