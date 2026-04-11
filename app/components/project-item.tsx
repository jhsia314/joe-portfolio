"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./animated-text";

interface ProjectItemProps {
  title: string;
  description: string;
  tags: string[];
  year: string;
  href?: string;
  index: number;
}

export default function ProjectItem({
  title,
  description,
  tags,
  year,
  href,
  index,
}: ProjectItemProps) {
  const Wrapper = href ? motion.a : motion.div;
  const wrapperProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer", "data-hover": "true" }
    : {};

  return (
    <FadeIn delay={index * 0.1}>
      <Wrapper
        className="group flex items-start justify-between gap-4 border-b border-border py-6 transition-colors"
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...wrapperProps}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-medium text-foreground transition-colors group-hover:text-foreground">
              {title}
            </h3>
            {href && (
              <motion.span
                className="inline-block text-muted"
                initial={{ opacity: 0, x: -4 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                &rarr;
              </motion.span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted transition-colors group-hover:text-accent">
            {description}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs font-mono text-muted transition-colors group-hover:border-accent group-hover:text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <span className="shrink-0 font-mono text-sm tabular-nums text-muted">
          {year}
        </span>
      </Wrapper>
    </FadeIn>
  );
}
