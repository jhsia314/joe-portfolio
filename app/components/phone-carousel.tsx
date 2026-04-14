"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, PanInfo } from "framer-motion";

interface PhoneCarouselProps {
  images: string[];
  title: string;
  gradient: string;
  cardTheme?: "dark" | "light";
  cardTitle?: string;
  description?: string;
  /** Pass false for landscape/full-bleed images that already fill the card */
  showFades?: boolean;
}

// Scrim and fade colours per theme
const THEME = {
  dark: {
    fadeColor: "#0a0e1a",
    scrim: "linear-gradient(to top, rgba(10,14,26,0.95) 0%, rgba(10,14,26,0.85) 25%, rgba(10,14,26,0.55) 55%, rgba(10,14,26,0) 85%)",
    titleColor: "text-white",
    descColor: "text-white/85",
    arrowBg: "bg-white/10 border-white/15 hover:bg-white/20",
  },
  light: {
    fadeColor: "#eceae7",
    scrim: "linear-gradient(to top, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 25%, rgba(255,255,255,0.65) 55%, rgba(255,255,255,0) 85%)",
    titleColor: "text-[#1a1816]",
    descColor: "text-[#3d3a38]",
    arrowBg: "bg-black/8 border-black/10 hover:bg-black/15",
  },
} as const;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "60%" : "-60%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-60%" : "60%",
    opacity: 0,
  }),
};

const spring = {
  type: "spring" as const,
  stiffness: 280,
  damping: 30,
  mass: 0.85,
};

const lightboxSpring = {
  type: "spring" as const,
  stiffness: 320,
  damping: 28,
  mass: 0.8,
};

export default function PhoneCarousel({
  images,
  title,
  gradient,
  cardTheme = "dark",
  cardTitle,
  description,
  showFades = true,
}: PhoneCarouselProps) {
  const theme = THEME[cardTheme];
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const count = images.length;

  useEffect(() => { setMounted(true); }, []);

  const paginate = useCallback(
    (delta: number) => {
      setState(([current]) => {
        const next = (current + delta + count) % count;
        return [next, delta];
      });
    },
    [count]
  );

  const goTo = useCallback((target: number) => {
    setState(([current]) => {
      if (target === current) return [current, 0];
      return [target, target > current ? 1 : -1];
    });
  }, []);

  // ESC closes lightbox globally (modal — always correct to close)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Arrow keys only active while this carousel is hovered
  useEffect(() => {
    if (!isHovered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isHovered, paginate]);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { x: swipe } = info.offset;
    const { x: vel } = info.velocity;
    if (swipe < -60 || vel < -500) paginate(1);
    else if (swipe > 60 || vel > 500) paginate(-1);
  };

  return (
    <div>
      {/* ── Card — same shape and scrim as every other WorkCard ─────────── */}
      <div
        className={`relative w-full ${showFades ? "aspect-[16/10]" : "aspect-[16/9]"} overflow-hidden rounded-2xl select-none`}
        style={{ background: gradient }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slides — portrait images centred, height-fitted */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            className="absolute inset-0 flex items-center justify-center"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
          >
            <img
              src={images[index]}
              alt={`${title} screen ${index + 1}`}
              className={`pointer-events-none ${showFades ? "h-full w-auto object-contain" : "w-full h-full object-contain"}`}
              draggable={false}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </motion.div>
        </AnimatePresence>

        {/* Side fades — only for portrait images that don't fill the card width */}
        {showFades && (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-32 z-10"
              style={{ background: `linear-gradient(to right, ${theme.fadeColor} 0%, transparent 100%)` }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-32 z-10"
              style={{ background: `linear-gradient(to left, ${theme.fadeColor} 0%, transparent 100%)` }}
            />
          </>
        )}

        {/* Drag + tap overlay — full card so swipe works anywhere.
            onTap fires only when no drag occurred → opens lightbox. */}
        <motion.div
          className="absolute inset-0 z-20 cursor-zoom-in"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          onTap={() => setLightboxOpen(true)}
          style={{ touchAction: "pan-y" }}
        />

        {/* Arrows — same style as before, z-30 above drag overlay */}
        <button
          type="button"
          aria-label="Previous screen"
          onClick={(e) => { e.stopPropagation(); paginate(-1); }}
          className={`absolute left-4 md:left-5 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full backdrop-blur-xl shadow-lg transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${theme.arrowBg} ${cardTheme === "light" ? "text-[#1a1816]" : "text-white"} ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-30 md:opacity-0 md:-translate-x-1"
          }`}
        >
          <svg className="h-4 w-4 md:h-[18px] md:w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Next screen"
          onClick={(e) => { e.stopPropagation(); paginate(1); }}
          className={`absolute right-4 md:right-5 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full backdrop-blur-xl shadow-lg transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${theme.arrowBg} ${cardTheme === "light" ? "text-[#1a1816]" : "text-white"} ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-30 md:opacity-0 md:translate-x-1"
          }`}
        >
          <svg className="h-4 w-4 md:h-[18px] md:w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Subtle bottom gradient for depth only — skip for landscape slides */}
        {showFades && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-2xl z-20"
            style={{ background: theme.scrim }}
          />
        )}

        {/* Inner ring for depth */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
      </div>

      {/* ── Control row: dots + counter ──────────────────────────────────── */}
      <div className="mt-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to screen ${i + 1}`}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              className="group p-1"
            >
              <span
                className={`block h-1 rounded-full transition-all duration-300 ease-out ${
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

      {/* Title + description below card — always readable */}
      {(cardTitle || description) && (
        <div className="mt-3 px-1">
          {cardTitle && (
            <h4 className="text-sm md:text-base font-semibold tracking-tight text-foreground">
              {cardTitle}
            </h4>
          )}
          {description && (
            <p className="mt-1 text-xs md:text-sm text-muted leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}


      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {lightboxOpen && (
              <motion.div
                key="lightbox-backdrop"
                className="fixed inset-0 z-[999] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setLightboxOpen(false)}
              >
                <div className="absolute inset-0 bg-black/92 backdrop-blur-md" />

                <motion.img
                  src={images[index]}
                  alt={`${title} screen ${index + 1} enlarged`}
                  className="relative max-h-[88vh] max-w-[88vw] object-contain rounded-xl shadow-2xl"
                  initial={{ scale: 0.86, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.86, opacity: 0 }}
                  transition={lightboxSpring}
                  onClick={(e) => e.stopPropagation()}
                  draggable={false}
                />

                <div className="absolute bottom-5 md:bottom-7 left-1/2 -translate-x-1/2 font-mono text-[11px] text-white/40 tabular-nums tracking-wider">
                  {String(index + 1).padStart(2, "0")}
                  <span className="text-white/20"> / </span>
                  {String(count).padStart(2, "0")}
                </div>

                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setLightboxOpen(false)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-white hover:bg-white/20 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <button
                  type="button"
                  aria-label="Previous screen"
                  onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                  className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-white hover:bg-white/20 transition-colors"
                >
                  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                <button
                  type="button"
                  aria-label="Next screen"
                  onClick={(e) => { e.stopPropagation(); paginate(1); }}
                  className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-white hover:bg-white/20 transition-colors"
                >
                  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
