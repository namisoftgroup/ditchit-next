import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { TYPES } from "@/utils/constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslations } from "next-intl";
import useUrlFilters from "@/hooks/useFilterParams";

export default function Type() {
  const { getParam, setParam } = useUrlFilters();
  const selectedSort = getParam("type") ?? "";
  const t = useTranslations("common");

  return (
    <AccordionItem value="item-5" className="border-[var(--lightBorderColor)]">
      <AccordionTrigger className="px-5 hover:no-underline data-[state=open]:bg-[var(--mainColor)] data-[state=open]:text-white rounded-none">
        {t("type")}
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 text-balance px-5 py-4">
        <RadioGroup
          defaultValue={selectedSort}
          onValueChange={(val) => setParam("type", val)}
          className="flex flex-col gap-6"
        >
          {TYPES.map((item) => (
            <div
              className="flex items-center justify-between gap-3"
              key={item.value}
            >
              <Label htmlFor={item.value}>{t(item.value)}</Label>
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
