"use client";

import posthog from "posthog-js";
import { motion } from "framer-motion";
import { LineReveal, FadeIn } from "./components/animated-text";
import Divider from "./components/divider";
import TimeDisplay from "./components/time-display";
import ThemeToggle from "./components/theme-toggle";
import WorkCard from "./components/work-card";
import ProductTabs from "./components/product-tabs";
import { ModalProvider, useModal } from "./components/modal-context";
import ImageModal from "./components/image-modal";
import InactivityLogout from "./components/inactivity-logout";

const stats = [
  { value: "22 years", label: "Product & design leadership" },
  { value: "1B+ users", label: "Products shaped at scale" },
  { value: "40-person", label: "Largest team built & led" },
];

const principles = [
  {
    title: "Drive clarity",
    description: "Turn ambiguity into direction teams can execute on",
    outcome: "decisions happen early, not after rework",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3l9 9-9 9" />
      </svg>
    ),
  },
  {
    title: "Align teams",
    description: "Unify product, design, and engineering around decisions",
    outcome: "alignment replaces debate",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="3" r="1.5" />
        <circle cx="12" cy="21" r="1.5" />
        <circle cx="3" cy="12" r="1.5" />
        <circle cx="21" cy="12" r="1.5" />
      </svg>
    ),
  },
  {
    title: "Scale systems",
    description: "Build systems that outlive individual features",
    outcome: "teams ship independently, not sequentially",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 20h12M6 16h12M6 12h12M6 8h12M6 4h12" />
      </svg>
    ),
  },
  {
    title: "Increase fidelity",
    description: "Bring ideas to life early through real product experiences",
    outcome: "alignment happens on reality, not speculation",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Lead hands-on",
    description: "Set direction and stay close enough to raise the bar",
    outcome: "quality increases without slowing teams",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
      </svg>
    ),
  },
  {
    title: "Drive through complexity",
    description: "Operate through ambiguity and shifting priorities",
    outcome: "progress continues without reset",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
      </svg>
    ),
  },
];

// Dark backdrop — enterprise/dark-UI products (Safe, Yahoo, Meta social)
const DARK_BG =
  "radial-gradient(ellipse at 50% 0%, #1a2036 0%, #0a0e1a 70%)";

// Light backdrop — consumer/light-UI products (Facebook, Google apps)
// Warm off-white so white screenshots dissolve naturally at the edges.
const LIGHT_BG =
  "radial-gradient(ellipse at 50% 100%, #f5f2ee 0%, #eceae7 70%)";

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
        gradient: DARK_BG,
        cardTheme: "dark" as const,
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
        gradient: DARK_BG,
        cardTheme: "dark" as const,
      },
    ],
  },
  {
    name: "Verily (Alphabet)",
    role: "Head of UX, Clinical Studies Platform",
    products: [
      {
        title: "Platform Vision & Storytelling",
        description:
          "Clinical and regulatory audiences don't default to trusting design. Crafted and evangelized a 3-year product vision, aligning design, product, and engineering around a shared north star at one of Alphabet's most complex and regulated organizations. Championed a storytelling culture that reframed design's role from pixel-level execution to strategic influence — earning sustained buy-in from regulatory, clinical, and executive stakeholders, and becoming the foundation for how the design org earned its seat at the table.",
        impact:
          "3-year product vision adopted across design, product, and engineering; storytelling practice recognized as a driver of executive and cross-functional alignment",
        phoneImages: [
          "/work/verily/vision/slide-03.jpg",
          "/work/verily/vision/slide-04.jpg",
          "/work/verily/vision/slide-11.jpg",
          "/work/verily/vision/slide-15.jpg",
          "/work/verily/vision/slide-17.jpg",
          "/work/verily/vision/slide-24.jpg",
          "/work/verily/vision/slide-30.jpg",
          "/work/verily/vision/slide-39.jpg",
          "/work/verily/vision/slide-41.jpg",
        ],
        gradient: DARK_BG,
        cardTheme: "dark" as const,
        showFades: false,
      },
      {
        title: "Clinical Studies Platform",
        description:
          "Verily's Clinical Studies Platform sits at the intersection of clinical research, data science, and participant experience — a domain where design had almost no precedent and very high stakes. Led the 0-to-1 UX build for a platform that orchestrates the full lifecycle of a clinical study: participant recruitment, data collection, researcher workflows, and regulatory reporting. Built and led a 20-person UX org from the ground up, embedding design into platform and systems thinking across data, research, and participant workflows. Introduced design sprints and rapid prototyping to shift engineering cadence and accelerate decision-making.",
        impact:
          "Built Verily's UX practice from zero, scaling to 20 people and shipping the foundational Clinical Studies Platform across multiple active research programs",
        phoneImages: [
          "/work/verily/e2e/slide-04.jpg",
          "/work/verily/e2e/slide-08.jpg",
          "/work/verily/e2e/slide-16.jpg",
          "/work/verily/e2e/slide-20.jpg",
          "/work/verily/e2e/slide-27.jpg",
          "/work/verily/e2e/slide-37.jpg",
          "/work/verily/e2e/slide-49.jpg",
          "/work/verily/e2e/slide-56.jpg",
          "/work/verily/e2e/slide-59.jpg",
        ],
        gradient: DARK_BG,
        cardTheme: "dark" as const,
        showFades: false,
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
        gradient: LIGHT_BG,
        cardTheme: "light" as const,
      },
      {
        title: "Reader",
        description:
          "Unified the story reading experience across Instagram and Facebook, solving for divergent interaction patterns while preserving what worked on each platform.",
        impact:
          "Unified cross-platform experience used by 500M+ daily active users",
        phoneImages: [
          "/work/meta/readers/slide-03.jpg",
          "/work/meta/readers/slide-04.jpg",
          "/work/meta/readers/slide-05.jpg",
          "/work/meta/readers/slide-07.jpg",
          "/work/meta/readers/slide-10.jpg",
          "/work/meta/readers/slide-13.jpg",
          "/work/meta/readers/slide-15.jpg",
          "/work/meta/readers/slide-16.jpg",
          "/work/meta/readers/slide-17.jpg",
          "/work/meta/readers/slide-20.jpg",
        ],
        gradient: LIGHT_BG,
        cardTheme: "light" as const,
        showFades: false,
      },
      {
        title: "Messaging in Blue",
        description:
          "Led the strategy and design to bring messaging back inside the Facebook app as a first-class experience. Partnered with Research and Data Science to redefine how people communicate without leaving the app.",
        impact: "200M+ users messaging inside Facebook within the first month of launch",
        gradient: DARK_BG,
        cardTheme: "dark" as const,
        comingSoon: true,
      },
    ],
  },
  {
    name: "Google",
    role: "Senior UX Design Manager",
    products: [
      {
        title: "Guess My Sketch",
        description:
          "Google needed a way to put AI into the hands of a billion people in China, on a platform it had never shipped on before. Led the Shanghai product and design team to build the first Google WeChat Mini Program from concept to launch in three months, a social drawing game where players sketched everyday objects for Google AI to guess. Six weeks later, shipped a live multiplayer Battle Royale mode on stage at Google Developer Day.",
        impact:
          "12.3M users in the first month, 100M+ sessions in six weeks, 1.5M DAU sustained, 63% of players associated the product with Google AI",
        phoneImages: [
          "/work/guess-my-sketch/5.png",
          "/work/guess-my-sketch/9.png",
          "/work/guess-my-sketch/7.png",
          "/work/guess-my-sketch/8.png",
          "/work/guess-my-sketch/6.png",
          "/work/guess-my-sketch/10.png",
          "/work/guess-my-sketch/11.png",
        ],
        gradient: LIGHT_BG,
        cardTheme: "light" as const,
      },
      {
        title: "Smart Stories",
        description:
          "69 million children in China are left behind while parents work, and technology had become a wedge rather than a bond. Co-led the vision and design for a voice-driven storytelling app that turned speech into animated worlds, pairing natural language understanding with delightfully hand-drawn illustrations so parents and kids could spark creativity together. Sponsored external user research in China, drove 0-to-dogfood, and advocated for a global expansion beyond the China Next Billion Users launch.",
        impact:
          "New family-tech product direction for China NBU, expanded into a global initiative in partnership with Disney on launch content",
        phoneImages: [
          "/work/smart-stories/2.png",
          "/work/smart-stories/9.png",
          "/work/smart-stories/14.png",
          "/work/smart-stories/13.png",
          "/work/smart-stories/7.png",
          "/work/smart-stories/10.png",
          "/work/smart-stories/11.png",
        ],
        gradient: LIGHT_BG,
        cardTheme: "light" as const,
      },
      {
        title: "Google Pay",
        cardTitle: "Google Pay",
        description:
          "Led the UX transition of Google China's NBU payments into Google Pay, consolidating fragmented experiences into a unified global platform. Drove end-to-end design across onboarding, payments, and core flows to ensure continuity and scalability. Contributed to the launch of the Google Pay app in Singapore, adapting the product for local market needs and enabling a seamless payments experience for a new region.",
        impact: "Launched Google Pay in Singapore; consolidated China NBU UX team into the global Google Payments team",
        gradient: LIGHT_BG,
        cardTheme: "light" as const,
        comingSoon: true,
      },
    ],
  },
  {
    name: "Yahoo",
    role: "Director of UX, APAC",
    products: [
      {
        title: "FUJI Design System — Yahoo (Global, 18+ products)",
        description:
          "Built Yahoo's global design system from the ground up, unifying design across mobile, web, and tablet. Defined core principles, created a scalable color architecture, and introduced the \"Orb\" visual identity adopted across 18+ verticals. Shipped a full component library, motion system, and documentation platform — driving consistent UX across Mail, News, Finance, Sports, Messenger, and APAC products.",
        impact:
          "~70% adoption across all Yahoo products within one year, +24% engagement across News, Sports, Finance, and E-Commerce, +64% feed engagement",
        phoneImages: [
          "/work/fuji/slide-2.png",
          "/work/fuji/slide-5.png",
          "/work/fuji/slide-7.png",
          "/work/fuji/slide-13.png",
          "/work/fuji/slide-19.png",
          "/work/fuji/slide-24.png",
          "/work/fuji/slide-44.png",
          "/work/fuji/slide-48.png",
        ],
        gradient: DARK_BG,
        cardTheme: "dark" as const,
        showFades: false,
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
            <div className="flex items-center gap-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  onClick={() => posthog.capture('contact_link_clicked', { label: link.label, href: link.href })}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-foreground hover:text-foreground"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
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
                Design Leadership, Consumer &amp; Enterprise
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
                Currently VP of Product Design and Creatives at{" "}
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
                <span className="text-lg md:text-3xl font-medium tracking-tight text-foreground">
                  {stat.value}
                </span>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted">
                  {stat.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </section>

        {/* ═══════════════ How I Lead ═══════════════ */}
        <div className="mt-10">
          <Divider />
        </div>
        <section className="mt-10">
          <FadeIn>
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted/50">
              How I Operate
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70 max-w-2xl">
              Turn complexity into direction. Align teams around decisions. Drive execution that scales.
            </p>
          </FadeIn>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2">
            {principles.map((p, i) => {
              const isLeftCol = i % 2 === 0;
              const isLastItem = i === principles.length - 1;
              const isSecondToLast = i === principles.length - 2;
              return (
                <FadeIn key={p.title} delay={i * 0.05}>
                  <div
                    className={[
                      "py-6",
                      isLeftCol ? "md:pr-10 md:border-r border-foreground/[0.06]" : "md:pl-10",
                      isLastItem
                        ? ""
                        : isSecondToLast
                        ? "border-b border-foreground/[0.06] md:border-b-0"
                        : "border-b border-foreground/[0.06]",
                    ].join(" ")}
                  >
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted leading-snug">
                      {p.description}
                    </p>
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full border border-foreground/[0.06] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted/70">
                        {p.outcome}
                      </span>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
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
                phoneImages={(company.products[0] as { phoneImages?: string[] }).phoneImages}
                gradient={company.products[0].gradient}
                cardTheme={(company.products[0] as { cardTheme?: "dark" | "light" }).cardTheme}
                showFades={(company.products[0] as { showFades?: boolean }).showFades}
                tags={[]}
                year=""
                index={0}
              />
            ) : (
              <ProductTabs products={company.products as any} />
            )}
          </section>
        ))}

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
      <InactivityLogout />
      <PageContent />
      <GlobalModal />
    </ModalProvider>
  );
}
