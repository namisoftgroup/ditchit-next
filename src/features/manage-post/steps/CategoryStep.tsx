"use client";

import { Category } from "@/types/category";
import { useFormContext } from "react-hook-form";
import Image from "next/image";

interface CategoryStepProps {
  next: () => void;
  categories: Category[];
}

export default function CategoryStep({ next, categories }: CategoryStepProps) {
  const { watch, setValue, trigger } = useFormContext();
  const selectedCategory = watch("category_id");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await trigger("category_id");
    if (isValid) {
      next();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-[16px]">Please select your post category</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((category) => (
            <label
              key={category.id}
              className={`flex items-center cursor-pointer w-full px-6 py-4 border rounded-xl transition-colors ${
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
              <div className="mr-3">
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
              </div>
              <span className="text-sm">{category.title}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button className="rounded-[12px] text-[14px] text-[var(--whiteColor)] px-6 py-3 bg-[var(--mainColor)] flex justify-center items-center gap-1 capitalize">
            Next
            <Image
              src="/icons/arrow.svg"
              alt="Next"
              width={14}
              height={14}
              className="brightness-0 invert scale-x-[-1]"
            />
          </button>
        </div>
      </form>
    </div>
  );
}
