"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TimeDisplay() {
  const [time, setTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <span className="font-mono text-sm text-muted">00:00:00</span>;

  return (
    <span className="font-mono text-sm tabular-nums text-muted">
      <AnimatePresence mode="popLayout">
        {time.split("").map((char, i) => (
          <motion.span
            key={`${i}-${char}`}
            initial={{ y: -8, opacity: 0, filter: "blur(2px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: 8, opacity: 0, filter: "blur(2px)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
