'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
    })
  }, [])

  return <>{children}</>
}
