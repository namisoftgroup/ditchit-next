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
import { useHomeFilter } from "@/features/listing/store";
import { saveLocationFilters } from "@/features/listing/action";
import { SHIPPING_METHODS } from "@/utils/constants";
import { useTransition } from "react";
import { useTranslations } from "next-intl";

interface SearchByModalProps {
  show: boolean;
  handleClose: () => void;
  handleZipSearch: () => void;
}

export default function SearchByModal({
  show,
  handleClose,
  handleZipSearch,
}: SearchByModalProps) {
  const { filter, setFilter } = useHomeFilter();
  const [isPending, startTransition] = useTransition();
  const selectedMethod = filter.delivery_method;
  const t = useTranslations("common");

  const onUpdateFilter = ({ key, value }: { key: string; value: string }) => {
    setFilter({ [key]: value });
  };

  const handleSeeListings = () => {
    startTransition(() => {
      saveLocationFilters({
        delivery_method: filter.delivery_method,
        kilometers: String(filter.kilometers),
      });
    });
    handleClose();
  };

  return (
    <Dialog open={show} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md p-6 rounded-lg bg-white shadow-xl space-y-6">
        {/* Header */}
        <DialogHeader className="relative">
          <DialogTitle className="text-[28px] font-bold">{t("location")}</DialogTitle>
          <DialogClose className="absolute top-4 end-4 text-gray-400 hover:text-gray-600 focus:outline-none" />
        </DialogHeader>

        <div className="flex flex-col gap-1">
          <label className="font-bold mb-2">{t("delivery_methods")}</label>

          <RadioGroup
            defaultValue={selectedMethod}
            onValueChange={(val) =>
              onUpdateFilter({ key: "delivery_method", value: val })
            }
            className="flex flex-col gap-3"
          >
            {SHIPPING_METHODS.map((item) => (
              <div className="flex items-center gap-3 rtl:flex-row-reverse" key={item.value}>
                <RadioGroupItem
                  value={item.value}
                  id={item.value}
                  className="border-[1px] border-[var(--darkColor)] data-[state=checked]:bg-[var(--mainColor)] data-[state=checked]:border-[var(--mainColor)] data-[state=checked]:text-white data-[state=checked]:[&>span>svg]:fill-white"
                />
                <Label htmlFor={item.value}>{t(item.name)}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-bold mb-2">{t("zip_code")}</label>
          <div
            className="flex justify-between items-center border-0 cursor-pointer"
            onClick={handleZipSearch}
          >
            <p className="text-sm text-dark">{filter.address}</p>
            <span className="text-lg font-bold">&gt;</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="distanceRange" className="font-bold">
            {t("miles")}:
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              id="distanceRange"
              name="distanceRange"
              min="0"
              max="100"
              step="1"
              value={filter.kilometers}
              onChange={(e) =>
                onUpdateFilter({ key: "kilometers", value: e.target.value })
              }
              className="flex-1 h-[10px] rounded-full bg-[#ddd] accent-[var(--mainColor)] appearance-none"
            />
            <div className="relative min-w-[100px] px-6 py-2 bg-[var(--mainColor)] text-[var(--whiteColor)] rounded-md flex justify-center items-center gap-1 text-sm">
              <span className="font-bold">
                {filter.kilometers === 100
                  ? t("maximum")
                  : `${filter.kilometers} ${t("miles")}`}
              </span>
              <div className="absolute w-4 h-4 bg-[var(--mainColor)] rotate-45 start-[-8px] top-1/2 -translate-y-1/2 rounded-sm" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-0">
          <button
            className="w-full px-4 py-2 rounded-full bg-[var(--mainColor)] text-white font-medium"
            onClick={handleSeeListings}
          >
            {isPending ? t("loading") : t("see_listings")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
