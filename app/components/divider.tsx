"use client";

import { motion } from "framer-motion";

export default function Divider() {
  return (
    <motion.div
      className="h-px w-full bg-border"
      initial={{ scaleX: 0, originX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
