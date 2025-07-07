import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SORT_BY } from "@/utils/constants";

export default function SortBy() {
  return (
    <AccordionItem value="item-1" className="border-[var(--lightBorderColor)]">
      <AccordionTrigger className="px-5 hover:no-underline data-[state=open]:bg-[var(--mainColor)] data-[state=open]:text-white rounded-bl-none rounded-br-none">
        Sort
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 text-balance px-5 py-4">
        <RadioGroup
          defaultValue={SORT_BY[0].value}
          className="flex flex-col gap-6"
        >
          {SORT_BY.map((item) => (
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor={item.value}>{item.name}</Label>
              <RadioGroupItem
                value={item.value}
                id={item.value}
                className="border-[2px] border-[var(--mainColor)] data-[state=checked]:bg-[var(--mainColor)] data-[state=checked]:border-[var(--mainColor) data-[state=checked]:text-white data-[state=checked]:[&>span>svg]:fill-white"
              />
            </div>
          ))}
        </RadioGroup>
      </AccordionContent>
    </AccordionItem>
  );
}
