import Link from "next/link";
import ProductCard from "@/components/cards/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CategorySlider() {
  return (
    <section className="py-[60px]">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1 mb-6">
          <div className="px-2">
            <span className="block text-[14px] font-semibold not-italic tracking-[2.8px] uppercase text-[var(--mainColor)]">
              Arts &amp; Crafts
            </span>
            <Link href="/all-posts?category=arts-and-crafts">
              <h4 className="text-[40px] font-bold text-[var(--darkColor)]">
                Browse items by{" "}
                <span className="text-[var(--mainColor)]">
                  Arts &amp; Crafts
                </span>
              </h4>
            </Link>
          </div>
        </div>

        {/* Carousel section */}
        <div className="relative">
          <Carousel opts={{ align: "start" }} className="w-full relative">
            <div className="flex justify-end gap-2 mb-4 pr-4">
              <CarouselPrevious className="absolute -top-16 right-16 left-initial" />
              <CarouselNext className="absolute -top-16 right-4" />
            </div>

            <CarouselContent>
              {Array.from({ length: 8 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                  <div className="p-1">
                    <ProductCard />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
