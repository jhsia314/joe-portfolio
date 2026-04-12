"use client";

import { useState, useCallback } from "react";
import posthog from "posthog-js";
import Image from "next/image";
import { motion } from "framer-motion";
import { FadeIn } from "./animated-text";
import { useModal } from "./modal-context";
import PhoneCarousel from "./phone-carousel";

interface WorkCardProps {
  title: string;
  role: string;
  description: string;
  cardTitle?: string;
  impact: string;
  tags: string[];
  year: string;
  image?: string;
  phoneImage?: string;
  phoneImages?: string[];
  gradient: string;
  cardTheme?: "dark" | "light";
  showFades?: boolean;
  index: number;
  href?: string;
  overlays?: React.ReactNode;
  comingSoon?: boolean;
}

export default function WorkCard({
  title,
  role,
  description,
  impact,
  tags,
  year,
  image,
  phoneImage,
  phoneImages,
  gradient,
  cardTheme = "dark",
  showFades = true,
  index,
  href = "#",
  overlays,
  cardTitle,
  comingSoon = false,
}: WorkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isAnyModalOpen, openModalWith } = useModal();

  const handleImageClick = useCallback(
    (e: React.MouseEvent) => {
      if (image) {
        e.preventDefault();
        e.stopPropagation();
        openModalWith(image, title, "");
        posthog.capture('work_image_opened', { title });
      }
    },
    [image, title, openModalWith]
  );

  const hasImage = !!image;
  const hasPhone = !!phoneImage;
  const hasCarousel = !!phoneImages && phoneImages.length > 0;
  const isPhoneVideo =
    !!phoneImage && /\.(mp4|webm|mov)$/i.test(phoneImage);

  // Carousel cards have their own layout (rounded image card + control row below).
  // The hover glass card is rendered inside PhoneCarousel so the arrows and dots
  // remain usable, while still matching the hover pattern of the other cards.
  if (hasCarousel) {
    return (
      <FadeIn delay={index * 0.15}>
        <div className="group relative block">
          <PhoneCarousel
            images={phoneImages!}
            title={title}
            gradient={gradient}
            cardTheme={cardTheme}
            showFades={showFades}
            cardTitle={cardTitle}
            description={description}
          />

          {/* Impact line */}
          <p className="mt-2 px-1 text-xs md:text-sm text-muted">{impact}</p>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn delay={index * 0.15}>
      <div className="group relative block">
        {/* Visual area: image or gradient */}
        <div
          className="relative w-full overflow-hidden rounded-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={hasImage ? handleImageClick : undefined}
          style={{ cursor: hasImage ? "zoom-in" : "default" }}
          data-hover="true"
        >
          {hasImage ? (
            <div>
              <Image
                src={image}
                alt={title}
                width={1920}
                height={1080}
                className="h-auto w-full rounded-2xl"
                sizes="(max-width: 768px) 100vw, 896px"
                quality={100}
                priority={index === 0}
                unoptimized
              />
            </div>
          ) : hasPhone ? (
            <div
              className="relative aspect-[16/10] flex items-center justify-center overflow-hidden"
              style={{ background: gradient }}
            >
              {/* Ambient radial glow */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, transparent 60%)",
                }}
              />
              {/* Phone frame */}
              <div className="relative h-[88%] aspect-[676/1392]">
                {/* Soft drop shadow under the device */}
                <div
                  className="absolute -inset-2 rounded-[1.25rem] blur-2xl opacity-60"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 70%)",
                  }}
                />
                <div className="relative h-full w-full overflow-hidden rounded-[0.875rem] ring-1 ring-white/15 shadow-2xl bg-black">
                  {isPhoneVideo ? (
                    <video
                      src={phoneImage}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Image
                      src={phoneImage!}
                      alt={title}
                      width={676}
                      height={1392}
                      className="h-full w-full object-contain"
                      quality={100}
                      priority={index === 0}
                      unoptimized
                    />
                  )}
                  {/* Subtle top highlight */}
                  <div className="pointer-events-none absolute inset-0 rounded-[0.875rem] ring-1 ring-inset ring-white/10" />
                </div>
              </div>
            </div>
          ) : (
            <div
              className="relative aspect-[16/10] flex items-center justify-center"
              style={{ background: gradient }}
            >
              {comingSoon && (
                <div className="flex flex-col items-center gap-3 select-none">
                  <span className={`font-mono text-[11px] uppercase tracking-[0.25em] ${cardTheme === "light" ? "text-black/30" : "text-white/40"}`}>
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Animated overlays */}
          {overlays}

          {/* Subtle inner shadow for depth */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />

          {/* Subtle bottom gradient for depth only */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-2xl"
            style={{
              background: cardTheme === "light"
                ? "linear-gradient(to top, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)"
                : "linear-gradient(to top, rgba(10,14,26,0.5) 0%, rgba(10,14,26,0) 100%)",
            }}
          />
        </div>

        {/* Title + description below card */}
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

        {/* Impact line */}
        <p className="mt-1.5 px-1 text-xs md:text-sm text-muted">
          {impact}
        </p>

        {/* CTA, only show if there is a real link */}
        {href && href !== "#" && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 ml-auto flex items-center gap-1.5 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
            data-hover="true"
          >
            View case study
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
              />
            </svg>
          </a>
        )}
      </div>
    </FadeIn>
  );
}
