import { Controller, useFormContext } from "react-hook-form";
import DynamicOPtions from "../DynamicOPtions";
import ExtraFeatures from "../ExtraFeatures";
import SelectField from "@/components/shared/SelectField";
import Image from "next/image";

type propTypes = {
  next: () => void;
  back: () => void;
  categoryOptions?: {
    id: number;
    title: string;
    type: "input" | "select";
    values: { id: number; title: string }[];
  }[];
};

export default function MoreDetailsStep({
  next,
  back,
  categoryOptions = [],
}: propTypes) {
  const {
    trigger,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await trigger(["features", "condition", "options"]);

    console.log(watch());
    console.log(errors);

    if (isValid) next();
  };

  return (
    <form className="flex flex-col gap-[16px]" onSubmit={handleSubmit}>
      <Controller
        name="condition"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Condition"
            id="condition"
            placeholder="Select Condition"
            error={errors.condition?.message as string}
            value={field.value}
            onChange={field.onChange}
            options={[
              { label: "New", value: "new" },
              { label: "Used", value: "used" },
            ]}
          />
        )}
      />

      <DynamicOPtions categoryOptions={categoryOptions} />

      <ExtraFeatures />

      <div className="flex justify-between mt-6">
        <button
          type="button"
          className="rounded-[12px] text-[var(--whiteColor)] text-[14px] px-6 py-3 bg-black flex justify-center items-center gap-1 capitalize"
          onClick={back}
        >
          <Image
            src="/icons/arrow.svg"
            alt="Previous"
            width={14}
            height={14}
            className="brightness-0 invert"
          />
          Previous
        </button>

        <button
          type="submit"
          className="rounded-[12px] text-[14px] text-[var(--whiteColor)] px-6 py-3 bg-[var(--mainColor)] flex justify-center items-center gap-1 capitalize"
        >
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
  );
}
