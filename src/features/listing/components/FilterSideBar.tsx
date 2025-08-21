"use client";

import { useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Category } from "@/types/category";
import { Search } from "lucide-react";
import Categoryfilter from "./Categoryfilter";
import PriceFilter from "./PriceFilter";
import SortBy from "./SortBy";
import useUrlFilters from "@/hooks/useFilterParams";

export default function FilterSideBar({
  categories,
}: {
  categories: Category[];
}) {
  const { getParam, setParam } = useUrlFilters();
  const [searchValue, setSearchValue] = useState(getParam("search") ?? "");

  return (
    <div className="flex flex-col gap-3">
      <form
        className="flex-1 w-full p-1 relative bg-[#f3f3f3] border border-[#e6e6e6] rounded-xl"
        onSubmit={(e) => {
          e.preventDefault();
          setParam("search", searchValue);
        }}
      >
        <input
          type="search"
          name="search"
          id="search"
          required
          value={searchValue}
          placeholder="Search"
          onChange={(e) => setSearchValue(e.target.value)}
          className="rounded-[100px] p-2 border-none min-h-[40px] bg-transparent placeholder:text-[var(--grayColor)] text-[var(--darkColor)] text-[14px] w-full"
        />

        <button
          type="submit"
          className="absolute right-1 top-[4px] bottom-[4px] p-0 w-9  flex items-center justify-center rounded-xl text-[var(--whiteColor)] bg-[var(--mainColor)]"
        >
          <Search height={20} width={20} />
        </button>
      </form>

      <div className="w-full rounded-xl border border-[var(--lightBorderColor)]">
        <Accordion
          type="single"
          collapsible
          defaultValue="item-2"
          className="w-full"
        >
          <SortBy />
          <Categoryfilter categories={categories} />
          <PriceFilter />
        </Accordion>
      </div>
    </div>
  );
}
