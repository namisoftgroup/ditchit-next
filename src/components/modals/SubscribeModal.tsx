"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  subscribeSchema,
  SubscribeFormValues,
  subscribeService,
} from "@/services/subscribeService";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import InputField from "../shared/InputField";
import SelectField from "../shared/SelectField";

export default function SubscribeModal({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: (open: boolean) => void;
}) {
  const t = useTranslations("common");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<SubscribeFormValues>({
    mode: "onChange",
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      country: "USA",
      mobile: "",
      first_name: "",
      last_name: "",
    },
  });

  const onSubmit = async (values: SubscribeFormValues) => {
    setLoading(true);
    const res = await subscribeService(values);
    setLoading(false);

    if (res.code === 200) {
      toast.success(t("subscribe_success"));
      reset();
      handleClose(false);
    } else {
      toast.error(t("subscribe_error"));
    }
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 bg-white shadow-xl space-y-6 rounded-[24px] gap-2">
        <DialogHeader className="mb-0">
          <DialogTitle className="text-[18px] font-bold capitalize">
            {t("subscribe")}
          </DialogTitle>

          <div className="flex flex-col gap-3">
            <form
              className="flex flex-col gap-4 mt-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex gap-2">
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      label={t("country")}
                      id="country"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { label: "USA", value: "USA" },
                        { label: "Canada", value: "Canada" },
                      ]}
                      placeholder={t("select_country")}
                      error={
                        errors.country?.message
                          ? t(errors.country?.message as string)
                          : undefined
                      }
                    />
                  )}
                />

                <div className="flex-1">
                  <InputField
                    id="mobile"
                    label={t("phone")}
                    placeholder={t("phone")}
                    {...register("mobile")}
                    error={
                      errors.mobile?.message
                        ? t(errors.mobile?.message as string)
                        : undefined
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <InputField
                  id="firstName"
                  placeholder={t("first_name")}
                  type="text"
                  {...register("first_name")}
                  error={
                    errors.first_name?.message
                      ? t(errors.first_name?.message as string)
                      : undefined
                  }
                />

                <InputField
                  id="lastName"
                  placeholder={t("last_name")}
                  type="text"
                  {...register("last_name")}
                  error={
                    errors.last_name?.message
                      ? t(errors.last_name?.message as string)
                      : undefined
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="customBtn rounded-full mb-5 mt-2 ms-auto me-0"
              >
                {loading ? t("loading") : t("send")}
              </button>
            </form>

            <p className="text-[12px] text-[#777]">{t("subscribe_text")}</p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
