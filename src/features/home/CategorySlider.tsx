import Link from "next/link";

export default function CategorySlider() {
  return (
    <section className="py-[60px]">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Category header */}
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1 mb-6">
          <div className="px-2">
            <span className="block text-[14px] font-semibold not-italic pb-[7px] tracking-[2.8px] uppercase text-[var(--mainColor)]">Arts &amp; Crafts</span>
            <Link href="/all-posts?category=arts-and-crafts">
              <h4 className="text-[40px] font-bold text-[var(--darkColor)]">
                Browse items by <span className="text-[var(--mainColor)]">Arts &amp; Crafts</span>
              </h4>
            </Link>
          </div>
        </div>

        {/* products slider */}
      </div>
    </section>
  );
}
