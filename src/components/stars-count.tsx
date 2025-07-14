"use client";

import React from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type StarsCountResponse = {
  stargazers_count: number;
};

/**
 * Displays the current stargazer count fetched from the API, or a placeholder if unavailable.
 *
 * Renders a styled placeholder when the data is loading or invalid, and shows the formatted star count when available.
 */
export function StarsCount() {
  const { data } = useSWR<StarsCountResponse>(`/api/stargazers_count`, fetcher);

  if (!data) {
    return <span className="bg-muted h-3 w-7 rounded-full" />;
  }

  if (data.stargazers_count < 0) {
    return <span className="bg-muted h-3 w-7 rounded-full" />;
  }

  return (
    <span className="text-muted-foreground w-7 text-center font-mono text-xs/none tabular-nums">
      {data.stargazers_count.toLocaleString()}
    </span>
  );
}
