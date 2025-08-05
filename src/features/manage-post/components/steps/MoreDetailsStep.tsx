import { Controller, useFormContext } from "react-hook-form";
import DynamicOPtions from "../DynamicOPtions";
import ExtraFeatures from "../ExtraFeatures";
import SelectField from "@/components/shared/SelectField";
import FormFooter from "../FormFooter";

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

      <FormFooter back={back} />
    </form>
  );
}
