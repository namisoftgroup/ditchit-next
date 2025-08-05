"use client";

import { Category } from "@/types/category";
import { usePostForm } from "./PostFormProvider";
import { useFormContext } from "react-hook-form";
import CategoryStep from "./steps/CategoryStep";
import MainDetailsStep from "./steps/MainDetailsStep";
import MoreDetailsStep from "./steps/MoreDetailsStep";
import PriceDetailsStep from "./steps/PriceDetailsStep";
import WizardTabs from "./WizardTabs";

export default function WizardForm({ categories }: { categories: Category[] }) {
  const { watch } = useFormContext();
  const { next, back, step } = usePostForm() as {
    step: number;
    next: () => void;
    back: () => void;
  };

  return (
    <div className="flex flex-col gap-6">
      <WizardTabs activeStepIndex={step} />

      {step === 0 && <CategoryStep next={next} categories={categories} />}

      {step === 1 && <MainDetailsStep next={next} back={back} />}

      {step === 2 && (
        <MoreDetailsStep
          next={next}
          back={back}
          categoryOptions={
            categories.find((c) => c.id === watch("category_id"))?.options
          }
        />
      )}

      {step === 3 && <PriceDetailsStep back={back} />}
    </div>
  );
}
