import InputField from "@/components/shared/InputField";
import Image from "next/image";

export default function SendCodeForm() {
  return (
    <form className="isolate p-[30px] rounded-[14px] shadow-[var(--BigShadow)] border-none flex flex-col gap-[16px]">
      <Image
        className="w-full max-h-[200px] aspect-[1] object-contain"
        src="/images/login.svg"
        alt="login"
        width={500}
        height={300}
      />

      <InputField
        label="Email"
        type="email"
        id="email"
        placeholder="example@example.com"
        // {...register("email")}
        // error={errors.email?.message}
      />
      
      <button type="submit" className="customBtn w-full rounded-full">
        Send Code
      </button>
    </form>
  );
}
