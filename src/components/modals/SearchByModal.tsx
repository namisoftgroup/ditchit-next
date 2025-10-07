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
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Input } from "../ui/input";
import { getCoordinates } from "@/utils/getCoordinatesByZipCode";
import { toast } from "sonner";
import { Country } from "@/types/country";
import SelectField from "../shared/SelectField";
// import ZipMapSearch from "../shared/ZipMapSearch";

interface SearchByModalProps {
  show: boolean;
  handleClose: () => void;
  handleZipSearch: () => void;
  countries: Country[];
}

export default function SearchByModal({
  show,
  handleClose,
  countries,
}: SearchByModalProps) {
  const t = useTranslations("common");

  const { filter, setFilter } = useHomeFilter();
  const [isPending, startTransition] = useTransition();
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
  const selectedMethod = filter.delivery_method;

  const onUpdateFilter = ({ key, value }: { key: string; value: string }) => {
    setFilter({ [key]: value });
  };

  const fetchCoordinates = async (zipCode: string) => {
    if (!zipCode) return;

    const result = await getCoordinates(String(zipCode));
    if (result) {
      setFilter({
        latitude: result.latitude,
        longitude: result.longitude,
        address: result.address,
      });
    } else {
      toast.error("Could not fetch coordinates. Please try a valid ZIP.");
    }
  };

  const handleGetLocation = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ zip_code: String(e.target.value) });
    fetchCoordinates(e.target.value);
  };

  const handleSeeListings = () => {
    startTransition(() => {
      saveLocationFilters({
        zip_code: String(filter.zip_code),
        latitude: filter.latitude,
        longitude: filter.longitude,
        address: filter.address,
      });
    });

    handleClose();
  };
  console.log("countries=============", countries, selectedCountry);

  return (
    <Dialog open={show} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md p-6 rounded-lg bg-white shadow-xl space-y-6">
        {/* Header */}
        <DialogHeader className="relative">
          <DialogTitle className="text-[28px] font-bold">
            {t("location")}
          </DialogTitle>
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
              <div
                className="flex items-center gap-3 rtl:flex-row-reverse"
                key={item.value}
              >
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

        <SelectField
          label={t("country")}
          id="country_id"
          value={selectedCountry ?? undefined}
          onChange={(val) => {
            setSelectedCountry(val);            
          }}
          options={countries.map((country) => ({
            label: (country as { title?: string })?.title ?? "",
            value: (country as { id?: number }).id?.toString() ?? "",
          }))}
          placeholder={t("select_country")}
          error={selectedCountry ? undefined : t("error to selected country")}
        />
        {selectedCountry && selectedCountry === "1" ? (
          <div className="flex flex-col gap-6">
            <div className="grid w-full gap-1 relative">
              <Label htmlFor="zip" className="font-bold mb-2">
                {t("enter_zip")}
              </Label>
              <Input
                id="zip"
                placeholder={t("enter_zip")}
                value={filter.zip_code}
                onChange={handleGetLocation}
                className="px-4 h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
              />
            </div>

            <Input
              id="address"
              readOnly
              placeholder={t("address")}
              value={filter.address}
              className="px-4 h-[48px] border-[var(--lightBorderColor)] border-t-0 border-r-0 border-l-0 shadow-none"
            />
          </div>
        ) : (
          <>
           {/* <ZipMapSearch countryId={selectedCountry || undefined} /> */}
          </>
        )}

        {/*zip code delete */}
        {/* <div className="flex flex-col gap-1">
          <label className="font-bold mb-2">{t("zip_code")}</label>
          <div
            className="flex justify-between items-center border-0 cursor-pointer"
            onClick={handleZipSearch}
          >
            <p className="text-sm text-dark">{filter.address}</p>
            <span className="text-lg font-bold">&gt;</span>
          </div>
        </div> */}

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
            {isPending ? t("loading") : t("change")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
