"use client";

import { motion } from "framer-motion";

interface RadarDotProps {
  top: string;
  left: string;
  color?: string;
}

export default function RadarDot({ top, left, color = "#ef4444" }: RadarDotProps) {
  return (
    <div
      className="absolute z-10"
      style={{ top, left, transform: "translate(-50%, -50%)" }}
    >
      {/* Cover the original dot */}
      <div
        className="absolute rounded-full"
        style={{
          width: "2.2%",
          height: "auto",
          aspectRatio: "1",
          background: "radial-gradient(circle, #1c1c28 60%, transparent 100%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: "14px",
          minHeight: "14px",
        }}
      />

      {/* Outer radar pulse 1, slow and wide */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 28,
          height: 28,
          border: `1px solid ${color}`,
          boxShadow: `0 0 8px ${color}40`,
        }}
        animate={{
          scale: [1, 2.5, 1],
          opacity: [0.4, 0, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.6, 1],
        }}
      />

      {/* Outer radar pulse 2 with offset timing */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 28,
          height: 28,
          border: `1px solid ${color}`,
          boxShadow: `0 0 6px ${color}30`,
        }}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
          times: [0, 0.6, 1],
        }}
      />

      {/* Inner glow ring, slow breathe */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 16,
          height: 16,
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          boxShadow: `0 0 12px ${color}30`,
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Core dot, heartbeat scale */}
      <motion.div
        className="relative rounded-full"
        style={{
          width: 8,
          height: 8,
          background: color,
          boxShadow: `0 0 6px ${color}80, 0 0 12px ${color}40`,
        }}
        animate={{
          scale: [1, 1.2, 1, 1.15, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.15, 0.35, 0.45, 0.6],
        }}
      />
    </div>
  );
}
