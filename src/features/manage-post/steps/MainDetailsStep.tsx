import { useFormContext } from "react-hook-form";
import TextField from "@/components/shared/TextField";
import InputField from "@/components/shared/InputField";
import MediaUpload from "@/components/shared/MediaUpload";
import ZipMapSearch from "@/components/shared/ZipMapSearch";
import Image from "next/image";

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
      <div className="flex gap-4">
        <MediaUpload label="Cover Image" />
        <MediaUpload customStyle="w-full" label="Post Images" multiple maxFiles={4} />
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

      <div className="flex justify-between mt-6">
        <button
          className="rounded-[12px] text-[var(--whiteColor)] text-[14px] px-6 py-3 bg-black flex justify-center items-center gap-1 capitalize"
          onClick={back}
        >
          <Image
            src="/icons/arrow.svg"
            alt="Next"
            width={14}
            height={14}
            className="brightness-0 invert"
          />
          Previous
        </button>

        <button className="rounded-[12px] text-[14px] text-[var(--whiteColor)] px-6 py-3 bg-[var(--mainColor)] flex justify-center items-center gap-1 capitalize">
          Next
          <Image
            src="/icons/arrow.svg"
            alt="Next"
            width={14}
            height={14}
            className="brightness-0 invert scale-x-[-1]"
          />
        </button>
      </div>
    </form>
  );
}
