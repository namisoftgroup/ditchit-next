"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/category";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import useUrlFilters from "@/hooks/useFilterParams";

export default function Categoryfilter({
  categories,
}: {
  categories: Category[];
}) {
  const { getParam, setParam } = useUrlFilters();
  const selectedCategory = getParam("category_id") ?? "";

  return (
    <AccordionItem value="item-2" className="border-[var(--lightBorderColor)]">
      <AccordionTrigger className="px-5 hover:no-underline data-[state=open]:bg-[var(--mainColor)] data-[state=open]:text-white rounded-none">
        Category
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 text-balance px-5 py-4">
        <RadioGroup
          defaultValue={selectedCategory}
          onValueChange={(val) => setParam("category_id", val)}
          className="flex flex-col gap-6"
        >
          {categories.map((category) => {
            const id = category.id.toString();

            return (
              <div className="flex items-center justify-between gap-3" key={id}>
                <Label htmlFor={id}>
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={22}
                    height={22}
                  />
                  {category.title}
                </Label>

                <RadioGroupItem
                  value={id}
                  id={id}
                  className="border-[1px] border-[var(--darkColor)] data-[state=checked]:bg-[var(--mainColor)] data-[state=checked]:border-[var(--mainColor)] data-[state=checked]:text-white data-[state=checked]:[&>span>svg]:fill-white"
                />
              </div>
            );
          })}
        </RadioGroup>
      </AccordionContent>
    </AccordionItem>
  );
}
