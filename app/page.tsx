"use client";

import { motion } from "framer-motion";
import { LineReveal, FadeIn } from "./components/animated-text";
import MagneticButton from "./components/magnetic-button";
import StatusDot from "./components/status-dot";
import Divider from "./components/divider";
import TimeDisplay from "./components/time-display";
import ThemeToggle from "./components/theme-toggle";
import WorkCard from "./components/work-card";
import ProductTabs from "./components/product-tabs";
import { ModalProvider, useModal } from "./components/modal-context";
import ImageModal from "./components/image-modal";

const stats = [
  { value: "22 years", label: "Product & design leadership" },
  { value: "1B+ users", label: "Products shaped at scale" },
  { value: "40+ people", label: "Teams built & led" },
];

const companies = [
  {
    name: "Safe Security",
    role: "VP of Product Design",
    products: [
      {
        title: "AI Vendor Risk",
        description:
          "Enterprises are racing to adopt AI vendors they cannot fully vet. Led the design of a system that reconciles what vendors claim, what contracts allow, and what users actually do into one continuous, decision-ready view of AI vendor risk.",
        impact:
          "40% lift in platform engagement, directly tied to enterprise renewal pipeline",
        image: "/work/Safe_TPRM.png",
        gradient:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      },
      {
        title: "SafeX",
        description:
          "We built SafeX for enterprise security teams responsible for making critical decisions in complex environments. Led the vision, design, and launch of Safe's first AI-native product, shifting from monitoring to an answer-driven experience that surfaces what matters, explains why it matters, and recommends what to do next. Defined the interaction model and trust patterns for AI-generated insights, delivered end to end from zero to GA.",
        impact:
          "Safe's first AI-native product, shipped zero to GA with 300+ enterprises now on SafeX",
        phoneImages: [
          "/work/safex/1.png",
          "/work/safex/2.png",
          "/work/safex/3.png",
          "/work/safex/4.png",
          "/work/safex/5.png",
        ],
        gradient:
          "linear-gradient(135deg, #0f0a1a 0%, #1a1033 50%, #2d1a4a 100%)",
      },
      {
        title: "Continuous Threat Exposure Management",
        description:
          "Designed the end-to-end workflow for security teams to continuously monitor, prioritize, and remediate exposure gaps across their attack surface.",
        impact:
          "New product line contributing to enterprise pipeline expansion",
        gradient:
          "linear-gradient(135deg, #1a1a2e 0%, #1e293b 50%, #334155 100%)",
      },
    ],
  },
  {
    name: "Meta",
    role: "Product Design Leader, Family of Apps",
    products: [
      {
        title: "Top of Feed",
        description:
          "The top of the Facebook feed had become a battleground. Stories, Messaging, Rooms, IG Stories, and Live Video were all shipping on their own logic, each competing for the most valuable real estate in the app. Led the work end to end, from strategy through design to engineering, reconciling them into one coherent hierarchy that defined what belongs above the feed, and why.",
        impact:
          "10% increase in daily engagement across 2B+ users, launched in 16 countries",
        phoneImage: "/work/Facebook_TopOfFeed.mp4",
        gradient:
          "linear-gradient(135deg, #0a1d3a 0%, #0d2a52 50%, #142c5e 100%)",
      },
      {
        title: "Messaging in Blue",
        description:
          "Led the strategy and design to bring messaging back inside the Facebook app as a first-class experience. Partnered with Research and Data Science to redefine how people communicate without leaving the app.",
        impact: "200M+ users messaging inside Facebook within the first month of launch",
        gradient:
          "linear-gradient(135deg, #00509e 0%, #0066cc 50%, #3388dd 100%)",
      },
      {
        title: "Readers",
        description:
          "Unified the story reading experience across Instagram and Facebook, solving for divergent interaction patterns while preserving what worked on each platform.",
        impact:
          "Unified cross-platform experience used by 500M+ daily active users",
        gradient:
          "linear-gradient(135deg, #833ab4 0%, #c13584 50%, #e1306c 100%)",
      },
    ],
  },
  {
    name: "Google",
    role: "Design Lead",
    products: [
      {
        title: "Google Pay",
        description:
          "Simplified complex payment flows into clear, trustworthy experiences across mobile and web for both consumers and merchants.",
        impact:
          "Shipped globally across Android, iOS, and web",
        gradient:
          "linear-gradient(135deg, #174ea6 0%, #1a73e8 50%, #4285f4 100%)",
      },
      {
        title: "Guess My Sketch",
        description:
          "Designed the end-to-end experience for an AI drawing game that used machine learning to recognize sketches in real-time, making Google AI playful and accessible.",
        impact: "Showcased Google AI capabilities to millions of users",
        gradient:
          "linear-gradient(135deg, #0d652d 0%, #188038 50%, #34a853 100%)",
      },
      {
        title: "Smart Stories",
        description:
          "Created a new content format that surfaced personalized information in a visual, swipeable experience, expanding how users discover content across Google's products.",
        impact: "New content surface shipped across Google's consumer products",
        gradient:
          "linear-gradient(135deg, #b06000 0%, #ea8600 50%, #fbbc04 100%)",
      },
    ],
  },
  {
    name: "Yahoo",
    role: "Senior Designer",
    products: [
      {
        title: "FUJI Design Language System",
        description:
          "Built Yahoo's unified design system from scratch, defining the visual language, component architecture, and interaction patterns adopted across every product in the portfolio.",
        impact:
          "Adopted across all Yahoo products, serving 700M+ monthly users",
        gradient:
          "linear-gradient(135deg, #3b0a6b 0%, #5f17a8 50%, #7b1fa2 100%)",
      },
    ],
  },
];

const links = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/joehsia",
    icon: (
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:jhsia314@gmail.com",
    icon: (
      <svg
        className="h-3.5 w-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
  },
];

function PageContent() {
  const { isAnyModalOpen } = useModal();

  return (
    <>
      <motion.div
        className="mx-auto flex w-full max-w-4xl flex-col px-6 py-12 md:px-8 md:py-20 lg:px-12 lg:py-24 font-sans"
        animate={{
          filter: isAnyModalOpen ? "blur(12px)" : "blur(0px)",
          scale: isAnyModalOpen ? 0.97 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* ═══════════════ Header ═══════════════ */}
        <header className="flex items-center justify-between">
          <LineReveal>
            <StatusDot />
          </LineReveal>
          <div className="flex items-center gap-4">
            <LineReveal delay={0.1}>
              <TimeDisplay />
            </LineReveal>
            <LineReveal delay={0.15}>
              <ThemeToggle />
            </LineReveal>
          </div>
        </header>

        {/* ═══════════════ Hero ═══════════════ */}
        <section className="mt-12 md:mt-16 lg:mt-20">
          <LineReveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.0] tracking-tighter text-foreground">
              Joe Hsia
            </h1>
          </LineReveal>
          <div className="mt-3 overflow-hidden">
            <LineReveal delay={0.5}>
              <span className="font-mono text-sm uppercase tracking-widest text-muted">
                Design Executive, Consumer &amp; Enterprise
              </span>
            </LineReveal>
          </div>
          <div className="mt-6 md:mt-8 space-y-4">
            <LineReveal delay={0.6}>
              <p className="text-base md:text-lg leading-relaxed text-muted max-w-2xl">
                22 years building products, leading design organizations, and
                shaping user experiences at Google, Meta, Yahoo, and in
                enterprise SaaS. I operate at the intersection of product
                vision, org building, and execution in spaces where design has
                to earn trust and drive measurable business outcomes.
              </p>
            </LineReveal>
            <LineReveal delay={0.7}>
              <p className="text-base md:text-lg leading-relaxed text-muted max-w-2xl">
                Currently VP of Product Design at{" "}
                <motion.a
                  href="https://safe.security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                  whileHover={{ letterSpacing: "0.02em" }}
                  transition={{ duration: 0.2 }}
                  data-hover="true"
                >
                  Safe Security
                </motion.a>
                , leading AI-native product experiences for cybersecurity.
              </p>
            </LineReveal>
          </div>
        </section>

        {/* ═══════════════ Career Signal ═══════════════ */}
        <div className="mt-10">
          <Divider />
        </div>
        <section className="mt-8 grid grid-cols-3 gap-4 md:gap-8">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.1}>
              <div>
                <span className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                  {stat.value}
                </span>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted">
                  {stat.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </section>

        {/* ═══════════════ Work ═══════════════ */}
        {companies.map((company, companyIndex) => (
          <section key={company.name}>
            <div className="mt-10">
              <Divider />
            </div>

            {/* Company header */}
            <FadeIn>
              <div className="mt-8 mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-foreground">
                  {company.name}
                </h2>
                <p className="mt-0.5 text-sm text-muted">{company.role}</p>
              </div>
            </FadeIn>

            {/* Products */}
            {company.products.length === 1 ? (
              <WorkCard
                title={company.products[0].title}
                cardTitle={company.products[0].title}
                role=""
                description={company.products[0].description}
                impact={company.products[0].impact}
                image={(company.products[0] as { image?: string }).image}
                gradient={company.products[0].gradient}
                tags={[]}
                year=""
                index={0}
              />
            ) : (
              <ProductTabs products={company.products as any} />
            )}
          </section>
        ))}

        {/* ═══════════════ Connect ═══════════════ */}
        <div className="mt-10">
          <Divider />
        </div>
        <section className="mt-10">
          <FadeIn>
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
              Get in Touch
            </h2>
          </FadeIn>
          <div className="mt-6 flex flex-wrap gap-3">
            {links.map((link, i) => (
              <FadeIn key={link.label} delay={i * 0.08 + 0.1}>
                <MagneticButton
                  href={link.href}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-foreground hover:text-foreground"
                >
                  {link.icon}
                  {link.label}
                  <svg
                    className="h-3 w-3 opacity-40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 17L17 7M17 7H7M17 7v10"
                    />
                  </svg>
                </MagneticButton>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ═══════════════ Footer ═══════════════ */}
        <footer className="mt-16 mb-8">
          <Divider />
          <FadeIn>
            <div className="mt-6 flex items-center justify-between">
              <span className="font-mono text-xs text-muted">
                &copy; {new Date().getFullYear()} Joe Hsia
              </span>
              <motion.span
                className="font-mono text-xs text-muted"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Crafted with intention
              </motion.span>
            </div>
          </FadeIn>
        </footer>
      </motion.div>
    </>
  );
}

function GlobalModal() {
  const { isAnyModalOpen, modalImage, modalAlt, closeModal } = useModal();

  return (
    <ImageModal
      src={modalImage || ""}
      alt={modalAlt}
      isOpen={isAnyModalOpen}
      onClose={closeModal}
    />
  );
}

export default function Home() {
  return (
    <ModalProvider>
      <PageContent />
      <GlobalModal />
    </ModalProvider>
  );
}
