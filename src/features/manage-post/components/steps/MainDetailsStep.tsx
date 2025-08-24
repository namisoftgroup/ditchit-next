"use client";

import { useFormContext } from "react-hook-form";
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
        <MediaUpload name="image" label="Cover Image" className="min-w-[236px]" />
        <MediaUpload
          name="images"
          label="Post Images"
          multiple
          maxFiles={4}
          className="w-full"
        />
      </div>

      <InputField
        label="Title"
        id="title"
        placeholder="Enter title"
        {...register("title")}
        error={errors.title?.message as string}
      />

      <TextField
        label="Description"
        id="description"
        placeholder="Enter Description"
        {...register("description")}
        error={errors.description?.message as string}
      />

      <InputField
        label="Zip Code"
        id="zip_code"
        placeholder="Enter ZIP Code"
        {...register("zip_code")}
        error={errors.zip_code?.message as string}
      />

      <InputField
        id="address"
        readOnly
        placeholder="Address"
        {...register("address")}
        error={errors.address?.message as string}
      />

      <input type="hidden" {...register("latitude")} />
      <input type="hidden" {...register("longitude")} />

      <ZipMapSearch />

      <FormFooter back={back} />
    </form>
  );
}
