"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useHomeFilter } from "@/features/listing/store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import SearchByModal from "../modals/SearchByModal";
import ZipSearch from "../modals/ZipSearch";
import LanguageMenu from "./LanguageMenu";

export default function LocationSearch({ hideSm }: { hideSm: boolean }) {
  const { filter } = useHomeFilter();
  const [show, setShow] = useState(false);
  const [showZipCodeSearch, setZipCodeSearch] = useState(false);

  const router = useRouter();
  const t = useTranslations("header");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;

    if (searchQuery) {
      router.push(`/posts?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div
      className={`items-center flex-1 gap-2 ${
        hideSm ? "md:flex hidden" : "flex md:flex-row flex-col items-start"
      }`}
    >
      <div className="flex items-center gap-2 w-full">
        <form
          className="flex-1 m-0 mb-0 min-w-[300px] relative md:bg-[#f3f3f3] bg-[#fff] border border-[#e6e6e6] rounded-full w-[min(100%_-_16px,_1440px)]"
          onSubmit={handleSubmit}
        >
          <input
            type="search"
            name="search"
            required
            className="rounded-[100px] px-4 py-2 border-none min-h-[40px] bg-transparent placeholder:text-[var(--grayColor)] text-[var(--darkColor)] text-[14px] w-full"
            placeholder={t("search")}
          />

          <button
            type="submit"
            className="absolute end-1 top-1/2 -translate-y-1/2 p-0 w-8 h-8 flex items-center justify-center rounded-full text-[var(--whiteColor)] bg-[var(--mainColor)]"
          >
            <Search height={20} width={20} />
          </button>
        </form>

        <LanguageMenu/>
      </div>

      <div
        className="flex gap-2 min-w-[250px] items-center cursor-pointer rounded-full"
        onClick={() => setShow(!show)}
      >
        <div className="min-w-[40px] aspect-square flex items-center justify-center bg-[var(--mainColor)] text-[var(--whiteColor)] rounded-full text-[20px]">
          <MapPin height={20} width={20} />
        </div>

        <div className="flex-1 flex flex-col">
          <p className="font-bold capitalize text-[var(--grayColor)] text-[12px] whitespace-nowrap">
            {t("current_location")}
          </p>
          <h4 className="text-[var(--darkColor)] capitalize overflow-hidden [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] text-[16px]">
            {filter.address}
          </h4>
        </div>
      </div>

      <SearchByModal
        show={show}
        handleClose={() => setShow(false)}
        handleZipSearch={() => {
          setZipCodeSearch(true);
          setShow(false);
        }}
      />

      <ZipSearch
        show={showZipCodeSearch}
        handleClose={() => setZipCodeSearch(false)}
        handleBack={() => {
          setZipCodeSearch(false);
          setShow(true);
        }}
      />
    </div>
  );
}
