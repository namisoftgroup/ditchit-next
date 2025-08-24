import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { CONDITIONS } from "@/utils/constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useUrlFilters from "@/hooks/useFilterParams";

export default function Condition() {
  const { getParam, setParam } = useUrlFilters();
  const selectedSort = getParam("condition") ?? "";

  return (
    <AccordionItem value="item-2" className="border-[var(--lightBorderColor)]">
      <AccordionTrigger className="px-5 hover:no-underline data-[state=open]:bg-[var(--mainColor)] data-[state=open]:text-white rounded-none">
        Condition
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 text-balance px-5 py-4">
        <RadioGroup
          defaultValue={selectedSort}
          onValueChange={(val) => setParam("condition", val)}
          className="flex flex-col gap-6"
        >
          {CONDITIONS.map((item) => (
            <div
              className="flex items-center justify-between gap-3"
              key={item.value}
            >
              <Label htmlFor={item.value}>{item.name}</Label>
              <RadioGroupItem
                value={item.value}
                id={item.value}
                className="border-[1px] border-[var(--darkColor)] data-[state=checked]:bg-[var(--mainColor)] data-[state=checked]:border-[var(--mainColor)] data-[state=checked]:text-white data-[state=checked]:[&>span>svg]:fill-white"
              />
            </div>
          ))}
        </RadioGroup>
      </AccordionContent>
    </AccordionItem>
  );
}
