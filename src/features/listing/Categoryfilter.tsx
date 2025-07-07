import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/category";
import Image from "next/image";

export default function Categoryfilter({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <AccordionItem value="item-2" className="border-[var(--lightBorderColor)]">
      <AccordionTrigger className="px-5 hover:no-underline data-[state=open]:bg-[var(--mainColor)] data-[state=open]:text-white rounded-none">
        Category
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 text-balance px-5 py-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="all">
              <Image src="/branding/fav.svg" alt="all" width={22} height={22} />
              All
            </Label>
            <Checkbox id="all" className="data-[state=checked]:bg-[var(--mainColor)] data-[state=checked]:border-[var(--mainColor) data-[state=checked]:text-white"/>
          </div>

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
                <Checkbox id={id} className="data-[state=checked]:bg-[var(--mainColor)] data-[state=checked]:border-[var(--mainColor) data-[state=checked]:text-white"/>
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
