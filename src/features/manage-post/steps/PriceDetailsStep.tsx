import Image from "next/image";

export default function PriceDetailsStep({ back }: { back: () => void }) {
  return (
    <form className="flex flex-col gap-[16px]">
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
