"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import SearchByModal from "../modals/SearchByModal";

export default function LocationSearch() {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div className="flex items-center flex-1 gap-x-4 gap-y-2">
      <form className="flex-1 m-0 mb-0 min-w-[300px] relative bg-[#f3f3f3] border border-[#e6e6e6] rounded-full w-[min(100%_-_16px,_1440px)]">
        <input
          type="search"
          name="search"
          required
          className="rounded-[100px] px-4 py-2 border-none min-h-[40px] bg-transparent"
          placeholder="Search"
        />

        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 p-0 w-8 h-8 flex items-center justify-center rounded-full text-[var(--whiteColor)] bg-[var(--mainColor)]"
        >
          <Search height={20} width={20} />
        </button>
      </form>

      <div
        className="flex gap-2 min-w-[250px] items-center cursor-pointer rounded-full"
        onClick={() => setShow(!show)}
      >
        <div className="min-w-[40px] aspect-square flex items-center justify-center bg-[var(--mainColor)] text-[var(--whiteColor)] rounded-full text-[20px]">
          <MapPin height={20} width={20} />
        </div>

        <div className="flex-1 flex flex-col">
          <p className="font-bold capitalize text-[var(--grayColor)] text-[12px] whitespace-nowrap">
            Current Location
          </p>
          <h4 className="text-[var(--darkColor)] capitalize overflow-hidden [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] text-[18px]">
            United States
          </h4>
        </div>
      </div>

      <SearchByModal show={show} handleClose={() => setShow(false)} />
    </div>
  );
}
