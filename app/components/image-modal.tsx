"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({ src, alt, isOpen, onClose }: ImageModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            style={{ cursor: "zoom-out" }}
          />

          {/* Close hint */}
          <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
            <span className="font-mono text-xs text-white/50">ESC</span>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
              data-hover="true"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Image */}
          <motion.div
            className="relative z-10 mx-6 max-h-[90vh] max-w-[90vw]"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onClose}
            style={{ cursor: "zoom-out" }}
          >
            <Image
              src={src}
              alt={alt}
              width={2560}
              height={1440}
              className="h-auto max-h-[90vh] w-auto max-w-[90vw] rounded-2xl shadow-2xl"
              quality={100}
              unoptimized
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
