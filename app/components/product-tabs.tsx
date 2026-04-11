"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WorkCard from "./work-card";

interface Product {
  title: string;
  description: string;
  impact: string;
  gradient: string;
  image?: string;
  phoneImage?: string;
  phoneImages?: string[];
}

interface ProductTabsProps {
  products: Product[];
}

export default function ProductTabs({ products }: ProductTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = products[activeIndex];
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  // Measure and animate the pill position
  useEffect(() => {
    const tab = tabRefs.current[activeIndex];
    const container = containerRef.current;
    if (tab && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();
      setPillStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  }, [activeIndex]);

  const handleTabClick = (i: number) => {
    setActiveIndex(i);
  };

  return (
    <div>
      {/* Pill tab bar */}
      <div
        ref={containerRef}
        className="relative inline-flex items-center gap-0.5 rounded-full bg-foreground/[0.04] p-1 mb-6"
      >
        {/* Sliding pill background */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-full bg-foreground/[0.08]"
          animate={{
            left: pillStyle.left,
            width: pillStyle.width,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />

        {products.map((product, i) => (
          <button
            key={product.title}
            ref={(el) => { tabRefs.current[i] = el; }}
            onClick={() => handleTabClick(i)}
            className="relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-200 rounded-full"
            style={{ cursor: "pointer" }}
          >
            <span
              className={
                i === activeIndex
                  ? "text-foreground"
                  : "text-muted hover:text-foreground/60"
              }
            >
              {product.title}
            </span>
          </button>
        ))}
      </div>

      {/* Active product card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <WorkCard
            title={active.title}
            cardTitle={active.title}
            role=""
            description={active.description}
            impact={active.impact}
            image={active.image}
            phoneImage={active.phoneImage}
            phoneImages={active.phoneImages}
            gradient={active.gradient}
            tags={[]}
            year=""
            index={0}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
