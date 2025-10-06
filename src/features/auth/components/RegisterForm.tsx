"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import { registerFormValues, registerSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { authAction } from "../actions";
import { useAuthStore } from "../store";
import { useTranslations } from "next-intl";
import InputField from "@/components/shared/InputField";
import SocialAuth from "./SocialAuth";
import ZipMapSearch from "../../../components/shared/ZipMapSearch";
import FormFooterLink from "./FormFooterLink";
import SelectField from "@/components/shared/SelectField";
import { Country } from "@/types/country";

export default function RegisterForm({ countries }: { countries: Country[] }) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const { setUser, setToken } = useAuthStore((state) => state);
  const router = useRouter();
  const t = useTranslations("auth");

  const methods = useForm<registerFormValues>({
    mode: "onChange",
    resolver: zodResolver(registerSchema),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: registerFormValues) => {
    setIsPending(true);
    const formData = new FormData();

    // console.log("Form data submitted:", data);

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
      const res = await authAction(formData, "/auth/register");

      if (res?.code === 200) {
        setUser(res.data.user);
        setToken(res.data.auth.token);
        toast.success(t("register_success"));
        router.push("/");
      } else {
        toast.error(res?.message || t("registeration_failed"));
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
        className="isolate p-[30px] rounded-[14px] shadow-[var(--BigShadow)] border-none flex flex-col gap-[16px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <AvatarUpload onImageChange={(file) => setValue("image", file)} />

        <InputField
          label={t("user_name")}
          id="username"
          placeholder={t("user_name")}
          {...register("name")}
          error={errors.name?.message ? t(errors.name?.message) : undefined}
        />

        <InputField
          label={t("phone_number")}
          id="phone"
          placeholder="(123) 456-7890"
          {...register("phone")}
          error={errors.phone?.message ? t(errors.phone?.message) : undefined}
        />

        <InputField
          label={t("email")}
          type="email"
          id="email"
          placeholder={t("email")}
          {...register("email")}
          error={errors.email?.message ? t(errors.email?.message) : undefined}
        />

        <InputField
          label={t("password")}
          type="password"
          id="password"
          placeholder={t("password")}
          {...register("password")}
          error={
            errors.password?.message ? t(errors.password?.message) : undefined
          }
        />
        <Controller
          name="country_id"
          control={methods.control}
          render={({ field }) => (
            <SelectField
              label={t("country")}
              id="country_id"
              value={field.value}
              onChange={field.onChange}
              options={countries.map((country) => ({
                label: (country as { title?: string })?.title ?? "",
                value: (country as { id?: number }).id?.toString() ?? "",
              }))}
              placeholder={t("select_country")}
              error={
                errors.country_id?.message
                  ? t(errors.country_id?.message)
                  : undefined
              }
            />
          )}
        />
        {methods.watch("country_id") !== "1" && (
          <InputField
            label={t("zip_code")}
            id="zip_code"
            placeholder={t("enter_zip")}
            {...register("zip_code")}
            error={
              errors.zip_code?.message ? t(errors.zip_code?.message) : undefined
            }
          />
        )}

        <InputField
          id="address"
          readOnly
          placeholder={t("address")}
          {...register("address")}
          error={
            errors.address?.message ? t(errors.address?.message) : undefined
          }
        />

        <input type="hidden" {...register("latitude")} />
        <input type="hidden" {...register("longitude")} />

        <ZipMapSearch countryId={methods.watch("country_id")} />

        <button
          type="submit"
          className="customBtn w-full rounded-full"
          disabled={isPending}
        >
          {isPending ? t("loading") : t("register")}
        </button>

        <FormFooterLink
          question={t("already_have_account")}
          linkText={t("login")}
          href="/login"
        />

        <SocialAuth />
      </form>
    </FormProvider>
  );
}
