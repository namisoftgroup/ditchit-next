"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import useUrlFilters from "@/hooks/useFilterParams";

export default function PriceFilter() {
  const { getParam, setParam } = useUrlFilters();
  const [priceFrom, setPriceFrom] = useState(getParam("price_from") ?? "");
  const [priceTo, setPriceTo] = useState(getParam("price_to") ?? "");

  return (
    <AccordionItem value="item-3" className="border-[var(--lightBorderColor)]">
      <AccordionTrigger className="px-5 hover:no-underline data-[state=open]:bg-[var(--mainColor)] data-[state=open]:text-white rounded-none">
        Price
      </AccordionTrigger>

      <AccordionContent className="flex flex-col gap-4 px-5 py-4">
        <div className="flex items-center gap-3 w-full">
          <input
            type="number"
            placeholder="From"
            value={priceFrom}
            min={0}
            onChange={(e) => {
              setPriceFrom(e.target.value);
              setParam("price_from", e.target.value);
            }}
            className="flex-1 w-[50%] rounded-lg border border-[var(--lightBorderColor)] p-2 text-sm outline-none focus:border-[var(--mainColor)]"
          />

          <span className="text-gray-400">-</span>

          <input
            type="number"
            placeholder="To"
            value={priceTo}
            min={0}
            onChange={(e) => {
              setPriceTo(e.target.value);
              setParam("price_to", e.target.value);
            }}
            className="flex-1 w-[50%] rounded-lg border border-[var(--lightBorderColor)] p-2 text-sm outline-none focus:border-[var(--mainColor)]"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
