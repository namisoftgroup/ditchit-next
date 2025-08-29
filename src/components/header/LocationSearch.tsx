"use client";

import { useState } from "react";
import { Search, MapPin, Globe } from "lucide-react";
import { useHomeFilter } from "@/features/listing/store";
import { LANGUAGES } from "@/utils/constants";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import SearchByModal from "../modals/SearchByModal";
import ZipSearch from "../modals/ZipSearch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function LocationSearch({ hideSm }: { hideSm: boolean }) {
  const { filter } = useHomeFilter();
  const [show, setShow] = useState(false);
  const [showZipCodeSearch, setZipCodeSearch] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const t = useTranslations("header");

  function handleLanguageChange(newLang: string) {
    if (!locale) return;
    const parts = locale.split("-");
    
    let updatedLocale: string;
    if (parts.length > 1) {
      updatedLocale = `${newLang}-${parts[parts.length - 1]}`;
    } else {
      updatedLocale = newLang;
    }

    router.replace(pathname, { locale: updatedLocale });
  }

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

        <DropdownMenu>
          <DropdownMenuTrigger className="w-[40px] h-[40px] flex items-center justify-center rounded-full border border-[var(--lightBorderColor)]">
            <Globe className="w-5 h-5 text-[var(--mainColor)]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[var(--whiteColor)] shadow-[0_2px_8px_rgba(0,0,0,0.1)] z-[99999] min-w-[200px] flex-col rounded border border-[var(--lightBorderColor)] max-h-[400px] overflow-y-auto">
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <DropdownMenuItem key={code} className="p-0">
                <button
                  onClick={() => handleLanguageChange(code)}
                  className="flex items-center gap-2 whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm w-full rounded-[8px]"
                >
                  {name}
                </button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
