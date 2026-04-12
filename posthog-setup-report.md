<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the portfolio. Key changes include: migrating initialization to `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), adding a reverse proxy via Next.js rewrites to reduce tracking blocker impact, creating a server-side PostHog client in `lib/posthog-server.ts`, and instrumenting seven custom events across five files covering the full visitor journey from login through portfolio engagement to contact conversion.

| Event | Description | File |
|-------|-------------|------|
| `contact_link_clicked` | User clicked a LinkedIn or Email contact link | `app/page.tsx` |
| `work_image_opened` | User clicked a work card image to open the fullscreen modal | `app/components/work-card.tsx` |
| `product_tab_switched` | User switched between product tabs within a company section | `app/components/product-tabs.tsx` |
| `theme_toggled` | User toggled between light and dark theme | `app/components/theme-toggle.tsx` |
| `login_submitted` | User submitted the password login form (client-side) | `app/login/login-form.tsx` |
| `login_succeeded` | User successfully authenticated (server-side) | `app/login/actions.ts` |
| `login_failed` | User failed to authenticate with wrong password (server-side) | `app/login/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/377562/dashboard/1455259
- Contact link clicks over time: https://us.posthog.com/project/377562/insights/0A1N58Xz
- Login conversion funnel: https://us.posthog.com/project/377562/insights/uKkzqrse
- Portfolio engagement (work images and tab switches): https://us.posthog.com/project/377562/insights/twyNPuI6
- Contact link clicks by type (LinkedIn vs Email): https://us.posthog.com/project/377562/insights/2UYH73Km
- Login success vs failure: https://us.posthog.com/project/377562/insights/KJE5lBjs

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
