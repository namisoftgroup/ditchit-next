"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { useHomeFilter } from "@/features/listing/store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Country } from "@/types/country";
import SearchByModal from "../modals/SearchByModal";
import ZipSearch from "../modals/ZipSearch";
import LanguagesAndCountries from "./LanguagesAndCountries";
import { User } from "@/types/user";
import { getCookie } from "@/lib/utils";

export default function LocationSearch({
  hideSm,
  countries,
  profileData,
}: {
  hideSm: boolean;
  countries: Country[];
  profileData: User | null;
}) {
  const { filter } = useHomeFilter();
  const [show, setShow] = useState(false);
  const [showZipCodeSearch, setZipCodeSearch] = useState(false);

  const router = useRouter();
  const t = useTranslations("header");

  const [currentCountry, setCurrentCountry] = useState<string>("us");

  useEffect(() => {
    if (profileData) {
      const cookieCountry = getCookie("countryId");
      setCurrentCountry(cookieCountry || profileData.country_id || "us");
    } else {
      setCurrentCountry("us");
    }
  }, [profileData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;

    if (searchQuery) {
      router.push(`/posts?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const memoizedCountries = useMemo(() => countries || [], [countries]);
  const memoizedProfileData = useMemo(() => profileData || null, [profileData]);

  return (
    <div
      className={`items-center flex-1 gap-2 ${
        hideSm ? "md:flex hidden" : "flex md:flex-row flex-col items-start"
      }`}
    >
      <div className="flex items-center gap-8 w-full md:flex-row flex-row-reverse">
        <LanguagesAndCountries
          countries={memoizedCountries}
          profileData={memoizedProfileData}
        />

        <form
          className="flex-1 m-0 mb-0 min-w-[250px] relative md:bg-[#f3f3f3] bg-[#fff] border border-[#e6e6e6] rounded-full"
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
      </div>

      <div
        className="flex gap-2 min-w-[160px] items-center cursor-pointer rounded-full"
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
            {filter.address
              ? filter.address
              : countries.find((c) => c.id === Number(currentCountry))?.title ||
                "United States"}
          </h4>
        </div>
      </div>

      <SearchByModal
        show={show}
        handleClose={() => setShow(false)}
        countries={countries}
        user={profileData}
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
