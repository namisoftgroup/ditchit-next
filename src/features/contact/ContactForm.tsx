"use client";

import { useForm } from "react-hook-form";
import InputField from "@/components/shared/InputField";
import TextField from "@/components/shared/TextField";

export default function ContactForm() {
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <div className="w-full h-full rounded-2xl p-6 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.102)]">
      <form className="flex flex-col gap-4">
        <div className="flex gap-5">
          <InputField
            label="Full Name"
            id="username"
            placeholder="User Name"
            {...register("name")}
            error={errors.name?.message as string}
          />

          <InputField
            label="Email"
            id="email"
            placeholder="Email"
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
            label="Subject"
            id="subject"
            placeholder="Subject"
            {...register("subject")}
            error={errors.subject?.message as string}
          />
        </div>

        <TextField
          label="Message"
          {...register("message")}
          error={errors.message?.message as string}
          id="message"
        />

        <div className="flex justify-end mt-4">
          <button type="submit" className="customBtn rounded-full ms-auto me-0">
            send
          </button>
        </div>
      </form>
    </div>
  );
}
