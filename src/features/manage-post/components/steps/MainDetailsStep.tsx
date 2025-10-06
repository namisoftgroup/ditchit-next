"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import InputField from "@/components/shared/InputField";
import MediaUpload from "@/lib/media/MediaUpload";
import ZipMapSearch from "@/components/shared/ZipMapSearch";
import FormFooter from "../FormFooter";

import SelectField from "@/components/shared/SelectField";
import { Country } from "@/types/country";
import { useState } from "react";

type propTypes = {
  next: () => void;
  back: () => void;
  countries: Country[];
};

export default function MainDetailsStep({ next, control, back, countries }: propTypes) {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext();

  const t = useTranslations("manage_post");
  const [countryId, setCountryId] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await trigger([
      "title",
      "description",
      "zip_code",
      "image",
      "address",
      "latitude",
      "longitude",
      "country_id",
    ]);

    if (isValid) {
      console.log("Form validation passed, proceeding to next step");
      next();
    } else {
      console.log("Form validation failed");
    }
  };
console.log(countries);

  return (
    <form className="flex flex-col gap-[16px]" onSubmit={handleSubmit}>
      <div className="flex gap-4 md:flex-row flex-col">
        <MediaUpload
          name="image"
          label={t("cover_image")}
          className="min-w-[236px]"
        />
        <MediaUpload
          name="images"
          label={t("post_images")}
        multiple
          maxFiles={4}
          className="w-full"
        />
      </div>

      <InputField
        label={t("title")}
        id="title"
        placeholder={t("enter_title")}
        {...register("title")}
        error={
         errors.title?.message ? t(errors.title?.message as string) : undefined
        }
      />

     <Controller
        name="country_id"
        control={control}
        render={({ field }) => {
          // Get all countries as options
          const countryOptions =
            countries?.map((country) => ({
              label: country.title,
              value: country.id.toString(),
            })) || [];

          // Use only the field value (no user fallback)
          const selectedCountry = field.value?.toString() || "";

          return (
            <SelectField
              label={t("country")}
              id="country_id"
              value={selectedCountry}
              onChange={(selectedValue) => {
                field.onChange(selectedValue); // Sends                 const countryId = field.value;مة في الكونسول
                  setCountryId(selectedValue)
              }}
              options={countryOptions}
              placeholder={t("select_country")}
              error={
                errors.country_id?.message
                  ? t(errors.country_id?.message as string)
                  : undefined
              }
            />
          );
        }}


      />
      {countryId !== '1' && (
        <InputField
        label={t("zip_code")}
        id="zip_code"
        placeholder={t("enter_zip")}
        {...register("zip_code")}
        error={
          errors.zip_code?.message
            ? t(errors.zip_code?.message as string)
            : undefined
        }
      />
      )}

      <InputField
        id="address"
        readOnly
        placeholder={t("address")}
        {...register("address")}
        error={
          errors.address?.message
            ? t(errors.address?.message as string)
            : undefined
        }
      />

      <input type="hidden" {...register("latitude")} />
      <input type="hidden" {...register("longitude")} />
      <ZipMapSearch  countryId={countryId} />

      <FormFooter back={back} />
    </form>
  );
}
