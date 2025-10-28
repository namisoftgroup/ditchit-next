"use client";

import { useEffect, useState } from "react";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/features/auth/store";
import { editProfileFormValues, editProfileSchema } from "../schema";
import InputField from "@/components/shared/InputField";
import clientAxios from "@/lib/axios/clientAxios";
import ZipMapSearch from "@/components/shared/ZipMapSearch";
import { Country } from "@/types/country";
import SelectField from "@/components/shared/SelectField";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function EditProfileForm({
  countries,
}: {
  countries: Country[];
}) {
  const { user, setUser } = useAuthStore();
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations("auth");

  const methods = useForm<editProfileFormValues>({
    mode: "onChange",
    resolver: zodResolver(editProfileSchema),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  // 👉 Compute selected country data based on country_id
  const selectedCountryId =
    methods.watch("country_id") || user?.country_id?.toString() || "";
  const countryData = countries.find(
    (c) => c.id.toString() === selectedCountryId
  );

  useEffect(() => {
    if (user?.id) {
      reset({
        name: user.name,
        email: user.email,
        zip_code: user.zip_code?.toString(),
        address: user.address,
        latitude: user.latitude,
        longitude: user.longitude,
        country_id: user.country_id?.toString(),
        phone: user.phone || "", // ✅ تأكد أن الرقم يُعاد ضبطه هنا
      });
    }
  }, [reset, user]);

  const handleFormSubmit = async (data: editProfileFormValues) => {
    setIsPending(true);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "image" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    try {
      const res = await clientAxios.post("/profile/updateProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res?.data.code === 200) {
        setUser(res.data.data.user);
        toast.success(t("update"));
      } else {
        toast.error(res?.data.message || "update profile failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(t("something_went_wrong"));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-[16px]"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <AvatarUpload
          onImageChange={(file) => setValue("image", file)}
          initialImage={user?.image}
        />

        <InputField
          label={t("user_name")}
          id="username"
          placeholder={t("user_name")}
          {...register("name")}
          error={errors.name?.message ? t(errors.name?.message) : undefined}
        />

        <InputField
          disabled={true}
          label={t("email")}
          type="email"
          id="email"
          placeholder={t("email")}
          {...register("email")}
          error={errors.email?.message ? t(errors.email?.message) : undefined}
        />

        <Controller
          name="phone"
          control={methods.control}
          render={({ field }) => (
            <div className="flex flex-col gap-1">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                {t("phone_number")}
              </label>

              <PhoneInput
                country={user?.country.code?.toLowerCase() || "us"} // الدولة الافتراضية
                value={field.value || user?.phone || ""} // عرض الرقم الموجود
                onChange={(phone) => field.onChange(phone)}
                enableSearch={true}
                searchPlaceholder={t("search_country")}
                inputProps={{
                  id: "phone",
                  name: "phone",
                  required: true,
                }}
                inputStyle={{
                  width: "100%",
                  borderRadius: "8px",
                  border: "1px solid var(--lightBorderColor)",
                  padding: "10px 12px 10px 48px",
                  fontSize: "14px",
                }}
                buttonStyle={{
                  borderRadius: "8px 0 0 8px",
                }}
                dropdownStyle={{
                  zIndex: 10000,
                }}
              />

              {errors.phone?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {t(errors.phone.message)}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="country_id"
          control={methods.control}
          render={({ field }) => {
            const countryOptions =
              countries?.map((country) => ({
                label: country.title,
                value: country.id.toString(),
              })) || [];

            const selectedCountry =
              field.value?.toString() || user?.country_id?.toString() || "";

            return (
              <SelectField
                label={t("country")}
                id="country_id"
                value={selectedCountry}
                onChange={(selectedValue) => {
                  field.onChange(selectedValue);
                }}
                options={countryOptions}
                placeholder={t("select_country")}
                error={
                  errors.country_id?.message
                    ? t(errors.country_id?.message)
                    : undefined
                }
              />
            );
          }}
        />

        {methods.watch("country_id") === "1" && (
          <>
            <InputField
              label={t("zip_code")}
              id="zip_code"
              placeholder={t("enter_zip")}
              {...register("zip_code")}
              error={
                errors.zip_code?.message
                  ? t(errors.zip_code?.message)
                  : undefined
              }
            />
            <input
              id="address"
              readOnly
              {...register("address")}
              className="px-2 text-xs -mt-5 h-[28px] border-[var(--lightBorderColor)] border-t-0 border-r-0 border-l-0 shadow-none"
            />
          </>
        )}

        <input type="hidden" {...register("latitude")} />
        <input type="hidden" {...register("longitude")} />
        {methods.watch("country_id") !== "1" ? (
          <ZipMapSearch
            countryId={methods.watch("country_id")}
            country={countryData as Country}
          />
        ) : (
          <div className="hidden">
            <ZipMapSearch
              countryId={methods.watch("country_id")}
              country={countryData as Country}
            />
          </div>
        )}

        <button
          type="submit"
          className="customBtn rounded-full w-fit px-12 ms-auto me-0 mt-4"
          disabled={isPending}
        >
          {isPending ? t("loading") : t("update")}
        </button>
      </form>
    </FormProvider>
  );
}
