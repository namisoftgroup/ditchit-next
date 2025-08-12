import { useEffect, useState } from "react";
import { useFormContext, SubmitHandler } from "react-hook-form";
import { SHIPPING_METHODS } from "@/utils/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { usePostForm } from "../../PostFormProvider";
import type { PostFormData } from "../../schema";
import InputField from "@/components/shared/InputField";
import BoostAndPublish from "@/components/modals/BoostAndPublish";
import FormFooter from "../FormFooter";

export default function PriceDetailsStep({
  back,
  postId,
}: {
  back: () => void;
  postId?: number;
}) {
  const {
    register,
    watch,
    trigger,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useFormContext<PostFormData>();

  const [show, setShow] = useState(false);
  const { savePost, isSaving } = usePostForm();
  const selectedDelivery = watch("delivery_method");

  const handleNextClick = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await trigger("price");

    if (isValid) {
      if (postId) {
        handleSubmit(onSubmit)();
      } else {
        setShow(true);
      }
    }
  };

  useEffect(() => {
    const handleCloseModal = () => setShow(false);
    window.addEventListener("close-post-modal", handleCloseModal);

    return () =>
      window.removeEventListener("close-post-modal", handleCloseModal);
  }, []);

  const onSubmit: SubmitHandler<PostFormData> = (data) => {
    savePost(data);
  };

  const onSubmitWithPromote: SubmitHandler<PostFormData> = (data) => {
    savePost({ ...data, is_promote: 1 });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleNextClick}>
      <InputField
        label="Price"
        id="price"
        placeholder="$0.00"
        {...register("price")}
        error={errors.price?.message as string}
        className="w-full"
      />

      <div className="my-3 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Checkbox
            id="firm_price"
            checked={watch("firm_price") === 1}
            onCheckedChange={(checked) =>
              setValue("firm_price", checked ? 1 : 0)
            }
          />
          <Label htmlFor="firm_price">Firm Price</Label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="virtual_tour"
            checked={watch("virtual_tour") === 1}
            onCheckedChange={(checked) =>
              setValue("virtual_tour", checked ? 1 : 0)
            }
          />
          <Label htmlFor="virtual_tour">Virtual tour</Label>
        </div>
      </div>

      <div>
        <h6 className="font-bold text-sm mb-2">Delivery methods</h6>
        <div className="flex gap-2">
          {SHIPPING_METHODS.map((method) => (
            <label
              key={method.value}
              htmlFor={method.value}
              className={`w-full rounded-[8px] border cursor-pointer py-3 px-4 text-center shadow-xs transition-all duration-300 ease-in-out hover:bg-[var(--mainColor)] hover:text-white
                ${
                  selectedDelivery === method.value
                    ? "bg-[var(--mainColor)] text-white border-[var(--mainColor)]"
                    : "border-[var(--lightBorderColor)]"
                }`}
            >
              <input
                type="radio"
                id={method.value}
                value={method.value}
                {...register("delivery_method")}
                className="hidden"
              />
              {method.name}
            </label>
          ))}
        </div>
      </div>

      <FormFooter
        back={back}
        nextBtnText={postId ? "Update Post" : "Confirm & Publish"}
      />

      <BoostAndPublish
        show={show}
        isSaving={isSaving}
        handleClose={() => setShow(false)}
        addPost={handleSubmit(onSubmit)}
        addAndPromote={handleSubmit(onSubmitWithPromote)}
      />
    </form>
  );
}
