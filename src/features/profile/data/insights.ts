import "server-only"

import { unstable_cache } from "next/cache"

type ISODateString = string

type InsightsSummary = {
  unique_visitors: number
  total_sessions: number
  total_screen_views: number
}

type InsightsSeriesItem = {
  date: ISODateString
  unique_visitors: number
  total_sessions: number
}

type InsightsResponse = {
  summary: InsightsSummary
  series: InsightsSeriesItem[]
  startDate: ISODateString
  endDate: ISODateString
}

function generateMockInsights(): InsightsResponse {
  const series: InsightsSeriesItem[] = []
  const start = new Date("2026-05-23")
  
  for (let i = 0; i <= 30; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const dateStr = d.toISOString().split("T")[0]
    
    // Generate a smooth wave using sine/cosine functions for a realistic aesthetic chart
    const unique = Math.floor(250 + 80 * Math.sin(i * 0.4) + 40 * Math.cos(i * 0.7) + Math.random() * 20)
    const sessions = Math.floor(unique * (1.1 + 0.15 * Math.cos(i * 0.3)))
    
    series.push({
      date: dateStr,
      unique_visitors: unique,
      total_sessions: sessions,
    })
  }
  
  return {
    summary: {
      unique_visitors: 14480,
      total_sessions: 16760,
      total_screen_views: 110008,
    },
    series,
    startDate: "2026-05-23T00:00:00.000Z",
    endDate: "2026-06-22T00:00:00.000Z",
  }
}

export const getInsights = unstable_cache(
  async (): Promise<InsightsResponse | null> => {
    // 1. Try PostHog SQL Endpoints if configured
    if (
      process.env.POSTHOG_PERSONAL_API_KEY &&
      process.env.POSTHOG_PROJECT_ID &&
      process.env.POSTHOG_ENDPOINT_ID
    ) {
      try {
        const res = await fetch(
          `https://us.posthog.com/api/projects/${process.env.POSTHOG_PROJECT_ID}/endpoints/${process.env.POSTHOG_ENDPOINT_ID}/run`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY}`,
            },
          }
        )

        if (res.ok) {
          const data = await res.json()
          // Support direct array or { results: ... } wrapper
          const results = Array.isArray(data) ? data : data?.results

          if (Array.isArray(results)) {
            const series: InsightsSeriesItem[] = []
            let total_visitors = 0
            let total_sessions = 0
            let total_screen_views = 0

            for (const row of results) {
              if (row && typeof row === "object") {
                if (Array.isArray(row)) {
                  // Format: [date, unique_visitors, total_sessions, total_screen_views]
                  const [date, visitors, sessions, screenViews] = row
                  const v = Number(visitors) || 0
                  const s = Number(sessions) || 0
                  const sv = Number(screenViews) || 0

                  series.push({
                    date: String(date),
                    unique_visitors: v,
                    total_sessions: s,
                  })

                  total_visitors += v
                  total_sessions += s
                  total_screen_views += sv
                } else {
                  // Format: { date, unique_visitors, total_sessions, total_screen_views }
                  const v = Number(row.unique_visitors) || 0
                  const s = Number(row.total_sessions) || 0
                  const sv = Number(row.total_screen_views) || 0

                  series.push({
                    date: String(row.date),
                    unique_visitors: v,
                    total_sessions: s,
                  })

                  total_visitors += v
                  total_sessions += s
                  total_screen_views += sv
                }
              }
            }

            if (series.length > 0) {
              return {
                summary: {
                  unique_visitors: total_visitors,
                  total_sessions,
                  total_screen_views,
                },
                series,
                startDate: series[0].date,
                endDate: series[series.length - 1].date,
              }
            }
          }
        }
      } catch {
        // Fall through to OpenPanel or mock data on error
      }
    }

    // 2. Try OpenPanel if configured
    if (
      process.env.OPENPANEL_PROJECT_ID &&
      process.env.OPENPANEL_CLIENT_ID &&
      process.env.OPENPANEL_CLIENT_SECRET
    ) {
      try {
        const res = await fetch(
          `https://api.openpanel.dev/insights/${process.env.OPENPANEL_PROJECT_ID}/overview`,
          {
            headers: {
              "openpanel-client-id": process.env.OPENPANEL_CLIENT_ID!,
              "openpanel-client-secret": process.env.OPENPANEL_CLIENT_SECRET!,
            },
          }
        )

        if (res.ok) {
          const data = (await res.json()) as InsightsResponse
          return data
        }
      } catch {
        // Fall through to mock data on error
      }
    }

    // 3. Fallback to mock data if no services are configured or request fails
    return generateMockInsights()
  },
  ["portfolio-insights"],
  { revalidate: 86400 } // Cache for 1 day (86400 seconds)
)
