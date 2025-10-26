"use client";

import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ContactFormValues, contactSchema } from "./schema";
import { sendContactForm } from "./service";
import { toast } from "sonner";
import InputField from "@/components/shared/InputField";
import TextField from "@/components/shared/TextField";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ContactFormValues>({
    mode: "onChange",
    resolver: zodResolver(contactSchema),
  });
  const t = useTranslations("contact");
  const [pending, setPending] = useState(false);

  const onSubmit = async (values: ContactFormValues) => {
    try {
      setPending(true);
      const res = await sendContactForm(values);
      if (res.code === 200) {
        toast.success(t("success_message"));
        reset();
      } else {
        toast.error(t("error_message"));
      }
    } catch (err) {
      console.log(err);
      toast.error(t("error_message"));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full h-full rounded-2xl p-6 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.102)]">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-5">
          <InputField
            label={t("full_name")}
            id="username"
            placeholder={t("full_name")}
            {...register("name")}
            error={
              errors.name?.message
                ? t(errors.name?.message as string)
                : undefined
            }
          />

          <InputField
            label={t("email")}
            id="email"
            placeholder={t("email")}
            {...register("email")}
            error={
              errors.email?.message
                ? t(errors.email?.message as string)
                : undefined
            }
          />
        </div>

        <div className="flex gap-4">
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="phone"
                  className="text-sm font-bold mb-1 text-gray-700"
                >
                  {t("phone")}
                </label>

                <PhoneInput
                  country={"us"} // الدولة الافتراضية، يمكن جعلها ديناميكية لاحقًا
                  value={field.value}
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
                    height: "45px",
                    borderRadius: "14px",
                    border: "1px solid var(--lightBorderColor)",
                    padding: "24px 12px 24px 48px",
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
                    {t(errors.phone.message as string)}
                  </p>
                )}
              </div>
            )}
          />
          <InputField
            label={t("subject")}
            id="subject"
            placeholder={t("subject")}
            {...register("subject")}
            error={
              errors.subject?.message
                ? t(errors.subject?.message as string)
                : undefined
            }
          />
        </div>

        <TextField
          label={t("message")}
          placeholder={t("message_placeholder")}
          {...register("message")}
          error={
            errors.message?.message
              ? t(errors.message?.message as string)
              : undefined
          }
          id="message"
        />

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="customBtn rounded-full ms-auto me-0 disabled:opacity-50"
            disabled={pending}
          >
            {pending ? t("sending") : t("send")}
          </button>
        </div>
      </form>
    </div>
  );
}
