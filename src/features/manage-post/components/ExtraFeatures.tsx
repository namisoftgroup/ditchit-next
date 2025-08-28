import InputField from "@/components/shared/InputField";
import { Plus, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

export default function ExtraFeatures() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const t = useTranslations("manage_post");

  const addFeature = () => {
    if (watch("features")?.length >= 5) return;
    setValue("features", [...(watch("features") || []), ""]);
  };

  const removeFeature = (index: number) => {
    setValue(
      "features",
      watch("features")?.filter(
        (_feature: string, featureIndex: number) => featureIndex !== index
      )
    );
  };

  return (
    <div>
      <h6 className="font-bold text-sm gap-2 my-4 flex items-center justify-between">
        {t("extra_features")}
        <span
          className="w-[48px] flex justify-center cursor-pointer"
          onClick={addFeature}
        >
          <Plus
            width={24}
            height={24}
            className="bg-[var(--mainColor)] rounded-full text-white p-1"
          />
        </span>
      </h6>

      <div className="flex flex-col gap-2">
        {watch("features")?.map((feature: string, index: number) => (
          <div className="flex items-center gap-2" key={index}>
            <InputField
              placeholder={t("enter_feature")}
              {...register(`features.${index}`)}
              id={`features.${index}`}
              error={
                Array.isArray(errors.features) && errors.features[index]
                  ? (errors.features[index]?.message as string)
                  : undefined
              }
            />
            <div
              className="w-[48px] h-[48px] rounded-[12px] cursor-pointer bg-gray-50 flex justify-center items-center"
              onClick={() => removeFeature(index)}
            >
              <Trash className="text-[#ff0000]" width={20} height={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
