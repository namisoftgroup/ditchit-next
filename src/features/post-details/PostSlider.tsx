"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import { Fancybox } from "@fancyapps/ui";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default function PostSlider({ images }: { images: string[] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  useEffect(() => {
    Fancybox.bind('[data-fancybox="gallery"]', {});
    return () => {
      Fancybox.unbind('[data-fancybox="gallery"]');
    };
  }, []);

  return (
    <div className="flex gap-4 lg:flex-row flex-col">
      <div className="lg:flex flex-col gap-2 max-h-[500px] overflow-y-auto hidden flex-1">
        <Swiper
          onSwiper={setThumbsSwiper}
          direction="vertical"
          spaceBetween={8}
          slidesPerView={5}
          watchSlidesProgress
          className="w-full h-full"
        >
          {images.map((src, idx) => (
            <SwiperSlide
              key={idx}
              className="cursor-pointer aspect-[4/3] max-h-[120px] min-h-[120px]"
            >
              <Image
                src={src}
                alt={`thumb-${idx}`}
                width={300}
                height={400}
                className="w-full h-full object-cover rounded-xl border hover:opacity-80 transition"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex-5 w-full rounded-2xl overflow-hidden shadow-md relative">
        <Swiper
          modules={[Navigation, Thumbs]}
          thumbs={{ swiper: thumbsSwiper }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          spaceBetween={10}
          className="w-full h-full"
        >
          {images.map((src, idx) => (
            <SwiperSlide key={idx} className="relative">
              <Image
                src={src}
                alt={`bg-blur-${idx}`}
                fill
                className="object-cover blur-[24px] absolute top-0 left-0 w-full h-full z-0"
              />

              <a
                href={src}
                data-fancybox="gallery"
                className="relative z-10 block"
              >
                <Image
                  src={src}
                  alt={`slide-${idx}`}
                  width={1000}
                  height={700}
                  className="w-full h-[400px] lg:h-[550px] object-contain rounded-xl"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiperControl absolute right-0 bottom-0 z-[4]">
          <div className="swiperBtns">
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
