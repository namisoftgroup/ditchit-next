import { Controller, useFormContext } from "react-hook-form";
import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";

interface optionsPorps {
  categoryOptions?: {
    id: number;
    title: string;
    type: "input" | "select";
    values: { id: number; title: string }[];
  }[];
}

export default function DynamicOPtions({ categoryOptions }: optionsPorps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      {categoryOptions?.map((opt, index) => {
        const isSelect = opt.type === "select";

        const selectOptions = opt.values.map((val) => ({
          label: val.title,
          value: val.id.toString(),
        }));

        return (
          <div key={opt.id}>
            {isSelect ? (
              <Controller
                name={`options.${index}.value`}
                control={control}
                render={({ field }) => (
                  <SelectField
                    label={opt.title}
                    id={`option-${opt.id}`}
                    placeholder={`Select ${opt.title}`}
                    error={
                      Array.isArray(errors.options) &&
                      errors.options[index]?.value?.message
                        ? errors.options[index]?.value?.message
                        : undefined
                    }
                    value={field.value}
                    onChange={field.onChange}
                    options={selectOptions}
                  />
                )}
              />
            ) : (
              <Controller
                name={`options.${index}.value`}
                control={control}
                render={({ field }) => (
                  <InputField
                    label={opt.title}
                    placeholder={`Enter ${opt.title}`}
                    id={`option-${opt.id}`}
                    {...field}
                    error={
                      Array.isArray(errors.options) &&
                      errors.options[index]?.value?.message
                        ? errors.options[index]?.value?.message
                        : undefined
                    }
                  />
                )}
              />
            )}

            <input
              type="hidden"
              {...register(`options.${index}.category_option_id`, {
                valueAsNumber: true,
              })}
              value={+opt.id}
            />
          </div>
        );
      })}
    </>
  );
}
