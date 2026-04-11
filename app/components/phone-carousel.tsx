"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";

interface PhoneCarouselProps {
  images: string[];
  title: string;
  gradient: string;
  cardTitle?: string;
  description?: string;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "110%" : "-110%",
    opacity: 0,
    scale: 0.92,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-110%" : "110%",
    opacity: 0,
    scale: 0.92,
  }),
};

const spring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 32,
  mass: 0.9,
};

export default function PhoneCarousel({
  images,
  title,
  gradient,
  cardTitle,
  description,
}: PhoneCarouselProps) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [isHovered, setIsHovered] = useState(false);
  const count = images.length;

  const paginate = useCallback(
    (delta: number) => {
      setState(([current]) => {
        const next = (current + delta + count) % count;
        return [next, delta];
      });
    },
    [count]
  );

  const goTo = useCallback(
    (target: number) => {
      setState(([current]) => {
        if (target === current) return [current, 0];
        return [target, target > current ? 1 : -1];
      });
    },
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paginate]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipe = info.offset.x;
    const velocity = info.velocity.x;
    const threshold = 60;
    if (swipe < -threshold || velocity < -500) {
      paginate(1);
    } else if (swipe > threshold || velocity > 500) {
      paginate(-1);
    }
  };

  return (
    <div>
      {/* Image card */}
      <div
        className="relative w-full aspect-[16/10] flex items-center justify-center overflow-hidden rounded-2xl select-none"
        style={{ background: gradient }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ambient radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, transparent 60%)",
          }}
        />

        {/* Phone frame, reclaims the full card height */}
        <div className="relative h-[92%] aspect-[1608/3496]">
          <div
            className="absolute -inset-2 rounded-[1.25rem] blur-2xl opacity-60 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 70%)",
            }}
          />

          <div className="relative h-full w-full overflow-hidden rounded-[0.875rem] ring-1 ring-white/15 shadow-2xl bg-black">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={index}
                className="absolute inset-0"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={spring}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={handleDragEnd}
              >
                {/* Plain img bypasses next/image so the raw 1608x3496 PNG is served
                    and the browser uses its high-quality downscaler. */}
                <img
                  src={images[index]}
                  alt={`${title} screen ${index + 1}`}
                  width={1608}
                  height={3496}
                  className="h-full w-full object-cover object-top pointer-events-none"
                  draggable={false}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  style={{ imageRendering: "auto" }}
                />
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 rounded-[0.875rem] ring-1 ring-inset ring-white/10" />
          </div>
        </div>

        {/* Arrow controls, hover-reveal on the gradient margins */}
        <button
          type="button"
          aria-label="Previous screen"
          onClick={(e) => {
            e.stopPropagation();
            paginate(-1);
          }}
          className={`absolute left-5 md:left-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/15 text-white shadow-lg transition-all duration-300 ease-out hover:bg-white/20 hover:scale-105 active:scale-95 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
          }`}
          data-hover="true"
        >
          <svg
            className="h-4 w-4 md:h-[18px] md:w-[18px]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.25}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Next screen"
          onClick={(e) => {
            e.stopPropagation();
            paginate(1);
          }}
          className={`absolute right-5 md:right-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/15 text-white shadow-lg transition-all duration-300 ease-out hover:bg-white/20 hover:scale-105 active:scale-95 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1"
          }`}
          data-hover="true"
        >
          <svg
            className="h-4 w-4 md:h-[18px] md:w-[18px]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.25}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>

        {/* Hover-reveal glass card with title and description, sits at the bottom
            so the arrow buttons at vertical center stay clickable */}
        {(cardTitle || description) && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden rounded-b-2xl">
            <div
              className={`border-t border-white/4 bg-white/15 backdrop-blur-xl backdrop-saturate-150 p-4 md:p-6 transition-all duration-200 ease-out ${
                isHovered
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0"
              }`}
            >
              {cardTitle && (
                <h4 className="text-sm md:text-base font-semibold tracking-tight text-white drop-shadow-sm mb-1 md:mb-2">
                  {cardTitle}
                </h4>
              )}
              {description && (
                <p className="text-xs md:text-sm font-medium leading-relaxed text-white/90 drop-shadow-sm">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Control row below the card, doesn't eat image space */}
      <div className="mt-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to screen ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                goTo(i);
              }}
              className="group p-1"
              data-hover="true"
            >
              <span
                className={`block h-1 rounded-full transition-all duration-400 ease-out ${
                  i === index
                    ? "w-6 bg-foreground"
                    : "w-1 bg-foreground/25 group-hover:bg-foreground/50"
                }`}
              />
            </button>
          ))}
        </div>

        <span className="font-mono text-[10px] md:text-xs tracking-wider text-muted tabular-nums">
          {String(index + 1).padStart(2, "0")}
          <span className="text-muted/50"> / </span>
          {String(count).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
