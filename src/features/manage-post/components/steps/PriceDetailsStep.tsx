import { useFormContext } from "react-hook-form";
import InputField from "@/components/shared/InputField";
import FormFooter from "../FormFooter";

export default function PriceDetailsStep({ back }: { back: () => void }) {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <form className="flex flex-col gap-[16px]">
      <InputField
        label="Price"
        id="price"
        placeholder="$0.00"
        {...register("price")}
        error={errors.price?.message as string}
      />

      <FormFooter back={back} nextBtnText="Confirm & Publish" />
    </form>
  );
}
