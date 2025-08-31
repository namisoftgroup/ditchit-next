"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import TextField from "@/components/shared/TextField";
import InputField from "@/components/shared/InputField";
import MediaUpload from "@/lib/media/MediaUpload";
import ZipMapSearch from "@/components/shared/ZipMapSearch";
import FormFooter from "../FormFooter";

type propTypes = {
  next: () => void;
  back: () => void;
};

export default function MainDetailsStep({ next, back }: propTypes) {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext();

  const t = useTranslations("manage_post");

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
    ]);

    if (isValid) {
      next();
    }
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

      <TextField
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

      <ZipMapSearch />

      <FormFooter back={back} />
    </form>
  );
}
