"use client";

import { useForm } from "react-hook-form";
import InputField from "@/components/shared/InputField";
import TextField from "@/components/shared/TextField";
import { useTranslations } from 'next-intl';

export default function ContactForm() {
  const {
    register,
    formState: { errors },
  } = useForm();

  const t = useTranslations("contact");

  return (
    <div className="w-full h-full rounded-2xl p-6 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.102)]">
      <form className="flex flex-col gap-4">
        <div className="flex gap-5">
          <InputField
            label={t("full_name")}
            id="username"
            placeholder={t("full_name")}
            {...register("name")}
            error={errors.name?.message as string}
          />

          <InputField
            label={t("email")}
            id="email"
            placeholder={t("email")}
            {...register("email")}
            error={errors.email?.message as string}
          />
        </div>

        <div className="flex gap-4">
          <InputField
            label="Phone"
            id="phone"
            placeholder="Phone"
            {...register("phone")}
            error={errors.phone?.message as string}
          />

          <InputField
            label={t("subject")}
            id="subject"
            placeholder={t("subject")}
            {...register("subject")}
            error={errors.subject?.message as string}
          />
        </div>

        <TextField
          label={t("message")}
          {...register("message")}
          error={errors.message?.message as string}
          id="message"
        />

        <div className="flex justify-end mt-4">
          <button type="submit" className="customBtn rounded-full ms-auto me-0">
            {t("send")}
          </button>
        </div>
      </form>
    </div>
  );
}
