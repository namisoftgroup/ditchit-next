import { Accordion } from "@/components/ui/accordion";
import { Category } from "@/types/category";
import Categoryfilter from "./Categoryfilter";
import PriceFilter from "./PriceFilter";
import SortBy from "./SortBy";

export default function AccordionFilter({
  categories,
}: {
  categories: Category[];
}) {
  return (
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
  );
}
