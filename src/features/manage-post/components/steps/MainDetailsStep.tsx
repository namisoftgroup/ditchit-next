"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import InputField from "@/components/shared/InputField";
import MediaUpload from "@/lib/media/MediaUpload";
import ZipMapSearch from "@/components/shared/ZipMapSearch";
import FormFooter from "../FormFooter";
import SelectField from "@/components/shared/SelectField";
import { Country } from "@/types/country";
import { useState, useEffect } from "react";
import { getCookie } from "@/lib/utils";

type propTypes = {
  next: () => void;
  back: () => void;
  countries: Country[];
};

export default function MainDetailsStep({ next, back, countries }: propTypes) {
  const {
    control,
    register,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const t = useTranslations("manage_post");
  const [countryId, setCountryId] = useState<string>(
    getCookie("countryId") || watch("country_id") || ""
  );
  const [countryData, setCountryData] = useState<Country | null>(null);
  // Keep state in sync if country_id in form changes externally (e.g., editing post)
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (
        name === "country_id" &&
        value.country_id &&
        value.country_id !== countryId
      ) {
        setCountryId(value.country_id as string);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, countryId]);

  useEffect(() => {
    if (countryId) {
      setValue("country_id", countryId, { shouldValidate: true });
    }
  }, [countryId, setValue]);

  useEffect(() => {
    if (countryId) {
      const selected = countries.find(
        (country) => country.id.toString() === countryId
      );
      setCountryData(selected || null);
    }
  }, [countryId, countries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await trigger([
      "title",
      "description",
      "image",
      "address",
      "latitude",
      "longitude",
      "country_id",
    ]);
    if (isValid) next();
  };

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

      <InputField
        label={t("description")}
        id="description"
        placeholder={t("enter_description")}
        {...register("description")}
        error={
          errors.description?.message
            ? t(errors.description?.message as string)
            : undefined
        }
      />

      {/* 🔽 اختيار الدولة */}
      <Controller
        name="country_id"
        control={control}
        render={({ field }) => {
          const countryOptions =
            countries?.map((country) => ({
              label: country.title,
              value: country.id.toString(),
            })) || [];

          return (
            <SelectField
              label={t("country")}
              id="country_id"
              value={countryId || field.value}
              onChange={(val) => {
                field.onChange(val);
                setCountryId(val);
                setValue("zip_code", "");
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

      {/* 🔽 لو الدولة 1 → يظهر zip_code فقط */}
      {countryId === "1" && (
        <>
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

          <input
            id="address"
            readOnly
            value={watch("address")}
            {...register("address")}
            className="px-2 text-xs -mt-5 h-[28px] border-[var(--lightBorderColor)] border-t-0 border-r-0 border-l-0 shadow-none"
          />
        </>
      )}

      {/* 🔽 لو الدولة ليست 1 → تظهر الخريطة */}
      {countryId !== "1" && countryData ? (
        <ZipMapSearch country={countryData} countryId={countryId} />
      ) : (
        <div className="hidden">
          {countryData && (
            <ZipMapSearch country={countryData} countryId={countryId} />
          )}
        </div>
      )}

      <input type="hidden" {...register("latitude")} />
      <input type="hidden" {...register("longitude")} />

      <FormFooter back={back} />
    </form>
  );
}
