"use client";

import posthog from "posthog-js";
import { motion } from "framer-motion";
import { login } from "./actions";

interface LoginFormProps {
  from: string;
  error: string | null;
}

const errorCopy: Record<string, string> = {
  invalid: "That password didn't match. Try again.",
  config: "The site is misconfigured. Please reach out.",
};

export default function LoginForm({ from, error }: LoginFormProps) {
  return (
    <main className="relative flex min-h-dvh flex-1 items-center justify-center overflow-hidden px-6 py-16">
      {/* Ambient background wash that echoes the work cards */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, rgba(99,102,241,0.12) 0%, transparent 70%), radial-gradient(50% 40% at 50% 80%, rgba(14,165,233,0.10) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Card */}
        <div className="rounded-2xl border border-foreground/10 bg-background/60 p-8 shadow-2xl backdrop-blur-xl backdrop-saturate-150 md:p-10">
          <div className="mb-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Private
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-[28px]">
              Joe Hsia
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              This portfolio is password-protected.
              <br />
              Enter the password to continue.
            </p>
          </div>

          <form action={login} className="space-y-3" onSubmit={() => posthog.capture('login_submitted')}>
            <input type="hidden" name="from" value={from} />

            <div className="relative">
              <input
                type="password"
                name="password"
                autoFocus
                required
                autoComplete="current-password"
                placeholder="Password"
                aria-label="Password"
                className="w-full rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-all duration-200 focus:border-foreground/30 focus:bg-foreground/[0.06] focus:ring-2 focus:ring-foreground/10"
              />
            </div>

            <button
              type="submit"
              data-hover="true"
              className="group relative w-full overflow-hidden rounded-xl bg-foreground px-4 py-3 text-sm font-medium tracking-tight text-background transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
            >
              <span className="relative z-10">Enter</span>
            </button>

            {error && errorCopy[error] && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-1 text-center text-xs text-red-500/90"
                role="alert"
              >
                {errorCopy[error]}
              </motion.p>
            )}
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70">
          Joe Hsia · Design Executive
        </p>
      </motion.div>
    </main>
  );
}
