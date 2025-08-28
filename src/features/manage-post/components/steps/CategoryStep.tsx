"use client";

import { Category } from "@/types/category";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import Image from "next/image";
import FormFooter from "../FormFooter";

interface CategoryStepProps {
  next: () => void;
  categories: Category[];
}

export default function CategoryStep({ next, categories }: CategoryStepProps) {
  const { watch, setValue, trigger } = useFormContext();
  const selectedCategory = watch("category_id");
  const t = useTranslations("manage_post");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await trigger("category_id");
    if (isValid) {
      next();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-[16px]">{t("select_category")}</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {categories.map((category) => (
            <label
              key={category.id}
              className={`flex items-center cursor-pointer gap-3 w-full px-6 py-4 border rounded-xl transition-colors ${
                selectedCategory === category.id
                  ? "bg-[var(--mainColor)] text-white"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={selectedCategory === category.id}
                onChange={() => setValue("category_id", category.id)}
                className="hidden"
                required
              />

              <Image
                src={category.image}
                alt={category.title}
                width={36}
                height={36}
                className={`transition-all ${
                  selectedCategory === category.id
                    ? "filter brightness-0 invert"
                    : ""
                }`}
              />
              <span className="text-sm">{category.title}</span>
            </label>
          ))}
        </div>

        <FormFooter showBackBtn={false} />
      </form>
    </div>
  );
}
