"use client";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  { src: "/banner/banner1.png", alt: "Banner 1" },
  { src: "/banner/banner2.png", alt: "Banner 2" },
  { src: "/banner/banner3.png", alt: "Banner 3" },
];

const DESKTOP_VISIBLE = 3; // how many images shown at once on desktop

export default function Banner() {
  /* ----------  DESKTOP  ---------- */
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  /* infinite loop helpers */
  const totalSlides = images.length;
  const loopNext  = useCallback(() => setIndex((i) => (i + 1) % totalSlides), [totalSlides]);
  const loopPrev  = useCallback(() => setIndex((i) => (i - 1 + totalSlides) % totalSlides), [totalSlides]);

  /* autoplay desktop */
  useEffect(() => {
    const timer = setInterval(loopNext, 5000);
    return () => clearInterval(timer);
  }, [loopNext]);

  /* transform without gap */
  useEffect(() => {
    if (!trackRef.current) return;
    const offset = -(index * 100) / DESKTOP_VISIBLE;
    trackRef.current.style.transform = `translateX(${offset}%)`;
  }, [index]);

  /* ----------  MOBILE  ---------- */
  const [mobileIdx, setMobileIdx] = useState(0);
  const nextMobile  = useCallback(() => setMobileIdx((i) => (i + 1) % images.length), []);
  const prevMobile  = () => setMobileIdx((i) => (i - 1 + images.length) % images.length);
  const goMobile    = (i: number) => setMobileIdx(i);

  useEffect(() => {
    const t = setInterval(nextMobile, 5000);
    return () => clearInterval(t);
  }, [nextMobile]);

  /* ----------  RENDER  ---------- */
  return (
    <section className="mb-6">
      {/* DESKTOP – 3-image side-by-side, no-gap loop */}
      <div className="hidden md:block relative w-full aspect-[12/2] overflow-hidden rounded-xl">
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-in-out"
        >
          {/* duplicated array to allow infinite sliding without empty space */}
          {[...images, ...images].map((img, i) => (
            <div
              key={i}
              className="w-1/3 flex-shrink-0 px-1"
            >
              <div className="relative aspect-[5/2] rounded-xl overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover rounded-xl"
                  sizes="33vw"
                  priority={i < 3}
                />
              </div>
            </div>
          ))}
        </div>

        {/* desktop arrows & dots */}
        <button
          aria-label="Previous"
          onClick={loopPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          aria-label="Next"
          onClick={loopNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "bg-black w-8" : "bg-[#cbcccc] w-2"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* MOBILE – single-slide carousel */}
      <div className="md:hidden relative w-full aspect-[16/9] rounded-lg overflow-hidden">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              idx === mobileIdx ? "opacity-100 z-10" : "opacity-0"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="100vw"
              priority={idx === 0}
            />
          </div>
        ))}

        <button
          aria-label="Previous"
          onClick={prevMobile}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full z-20"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          aria-label="Next"
          onClick={nextMobile}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full z-20"
        >
          <ChevronRight size={18} />
        </button>

        <div className="flex justify-center gap-2 py-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goMobile(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === mobileIdx ? "bg-black w-8" : "bg-[#cbcccc] w-2"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}